#version 300 es
#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

in lowp vec4 v_color;
in mediump vec2 v_lightSamplePos;

in mediump vec2 v_texCoords1;
in mediump vec2 v_texCoords2;

in lowp float v_blendAlpha;
in lowp float v_isLit;
in lowp float v_alphaRef;

uniform sampler2D u_lightTexture;
uniform lowp vec2 u_lightTextureSize;

uniform sampler2D u_texture;

out lowp vec4 fragColour;

// ------------------------------------------------------
void main()
{
	lowp vec3 light = texture(u_lightTexture, v_lightSamplePos).rgb * 0.4;

	lowp vec2 sampleOffset = 1.0 / u_lightTextureSize;
	light += texture(u_lightTexture, v_lightSamplePos + vec2(-sampleOffset.x, -sampleOffset.y)).rgb * 0.15;
	light += texture(u_lightTexture, v_lightSamplePos + vec2(sampleOffset.x, sampleOffset.y)).rgb * 0.15;
	light += texture(u_lightTexture, v_lightSamplePos + vec2(-sampleOffset.x, sampleOffset.y)).rgb * 0.15;
	light += texture(u_lightTexture, v_lightSamplePos + vec2(sampleOffset.x, -sampleOffset.y)).rgb * 0.15;

	light = mix(vec3(1.0, 1.0, 1.0), light, v_isLit);

	lowp vec4 col1 = texture(u_texture, v_texCoords1);
	lowp vec4 col2 = texture(u_texture, v_texCoords2);

	lowp vec4 outCol = mix(col1, col2, v_blendAlpha);
	outCol *= step(v_alphaRef, outCol.a);

	fragColour = clamp(v_color * outCol, 0.0, 1.0) * vec4(light.rgb, 1.0);
}