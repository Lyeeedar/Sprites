#version 300 es
#define PI 3.1415926538

// per vertex
in vec2 a_position;

// per instance
in vec4 a_pos_width_height;
in vec4 a_texCoords0;
in vec4 a_texCoords1;
in vec4 a_color;
in vec4 a_blendAlpha_isLit_alphaRef_rotation;
in float a_smoothLighting;

uniform mat4 u_projTrans;
uniform vec2 u_offset;

out vec4 v_color;
out vec2 v_lightSamplePos;

out vec2 v_texCoords1;
out vec2 v_texCoords2;

out float v_blendAlpha;
out float v_isLit;
out float v_alphaRef;

void main()
{
	vec2 vertexPos = a_position;

	float rotation = a_blendAlpha_isLit_alphaRef_rotation.w * PI * 2.0;
	float c = cos(rotation);
	float s = sin(rotation);

	vec2 rotatedVertexPos = vec2(vertexPos.x * c - vertexPos.y * s, vertexPos.x * s + vertexPos.y * c);

	vec2 halfSize = a_pos_width_height.zw * 0.5;
	vec2 worldPos = rotatedVertexPos * halfSize + a_pos_width_height.xy;
	vec2 basePos = a_pos_width_height.xy - vec2(0.0, halfSize.y * 0.8);
	vec4 viewPos = vec4(worldPos.xy + u_offset, 0.0, 1.0);
	vec4 screenPos = u_projTrans * viewPos;
	vec4 baseScreenPos = u_projTrans * vec4(basePos.xy + u_offset, 0.0, 1.0);

	v_color = a_color;
	v_lightSamplePos = mix((baseScreenPos.xy + 1.0) / 2.0, (screenPos.xy + 1.0) / 2.0, a_smoothLighting);

	vec2 texCoordAlpha = (vertexPos + 1.0) / 2.0;
	v_texCoords1 = mix(a_texCoords0.xy, a_texCoords0.zw, texCoordAlpha);
	v_texCoords2 = mix(a_texCoords1.xy, a_texCoords1.zw, texCoordAlpha);

	v_blendAlpha = a_blendAlpha_isLit_alphaRef_rotation.x;
	v_isLit = float(a_blendAlpha_isLit_alphaRef_rotation.y == 0.0);
	v_alphaRef = a_blendAlpha_isLit_alphaRef_rotation.z;

	gl_Position = screenPos;
}