#version 300 es

in vec4 a_position;
in vec4 a_color;
in vec2 a_texCoord0;

uniform mat4 u_projTrans;

out vec4 v_color;
out vec2 v_lightSamplePos;

out vec2 v_texCoords1;
out vec2 v_texCoords2;

out float v_blendAlpha;
out float v_isLit;
out float v_alphaRef;

void main()
{
	v_color = a_color;
	v_texCoords1 = a_texCoord0;
	gl_Position =  u_projTrans * a_position;

	v_lightSamplePos = (gl_Position.xy + 1.0) / 2.0;

	v_texCoords2 = vec2(0.0, 0.0);

	v_blendAlpha = 0.0;
	v_isLit = 1.0;
	v_alphaRef = 0.0;
}