#version 300 es
#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

in lowp vec4 v_color;
in mediump vec2 v_lightPos;
in mediump vec2 v_pixelPos;
in lowp float v_lightRange;
in lowp float v_brightness;
in lowp vec2 v_region_offset_count;

uniform lowp vec4 u_shadowRegions[128];

out lowp vec4 fragColour;

// ------------------------------------------------------
lowp float rayBoxIntersect ( lowp vec2 rpos, lowp vec2 rdir, lowp vec2 vmin, lowp vec2 vmax )
{
	lowp float t0 = (vmin.x - rpos.x) * rdir.x;
	lowp float t1 = (vmax.x - rpos.x) * rdir.x;
	lowp float t2 = (vmin.y - rpos.y) * rdir.y;
	lowp float t3 = (vmax.y - rpos.y) * rdir.y;

	lowp float t4 = max(min(t0, t1), min(t2, t3));
	lowp float t5 = min(max(t0, t1), max(t2, t3));

	lowp float t6 = (t5 < 0.0 || t4 > t5) ? -1.0 : t4;
	return t6;
}

// ------------------------------------------------------
lowp float insideBox(lowp vec2 v, lowp vec2 bottomLeft, lowp vec2 topRight)
{
    lowp vec2 s = step(bottomLeft, v) - step(topRight, v);
    return s.x * s.y;
}

// ------------------------------------------------------
lowp float isPixelVisible()
{
	mediump vec2 diff = v_lightPos - v_pixelPos;
	lowp float rayLen = length(diff);
	lowp vec2 rdir = 1.0 / (diff / rayLen);

	lowp float collided = 0.0;
	for (int i = 0; i < int(v_region_offset_count.y); i++)
	{
		lowp vec4 occluder = u_shadowRegions[int(v_region_offset_count.x) + i];
		lowp float intersect = rayBoxIntersect(v_pixelPos, rdir, occluder.xy, occluder.zw);

		collided += float(intersect > 0.0 && intersect < rayLen && insideBox(v_pixelPos, occluder.xy, occluder.zw) == 0.0);
	}

	return float(collided == 0.0);
}

// ------------------------------------------------------
lowp float calculateLightStrength()
{
	mediump vec2 diff = v_lightPos - v_pixelPos;
	lowp float distSq = (diff.x * diff.x) + (diff.y * diff.y);
	lowp float rangeSq = v_lightRange * v_lightRange;

	lowp float lightStrength = step(distSq, rangeSq);
	lowp float alpha = 1.0 - (distSq / rangeSq);

	lowp float isVisible = isPixelVisible();

	return lightStrength * alpha * isVisible;
}

// ------------------------------------------------------
void main()
{
	lowp float lightStrength = calculateLightStrength();
	fragColour = v_color * v_brightness * lightStrength;
}