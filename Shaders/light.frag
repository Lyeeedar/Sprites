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

out lowp vec4 fragColour;

lowp float calculateLightStrength()
{
	mediump vec2 diff = v_lightPos - v_pixelPos;
	lowp float distSq = (diff.x * diff.x) + (diff.y * diff.y);
	lowp float rangeSq = v_lightRange * v_lightRange;

	lowp float lightStrength = step(distSq, rangeSq);
	lowp float alpha = 1.0 - (distSq / rangeSq);

	return lightStrength * alpha;
}

void main()
{
	lowp float lightStrength = calculateLightStrength();
	fragColour = v_color * v_brightness * lightStrength;
}