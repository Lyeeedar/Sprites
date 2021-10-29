#version 300 es

// per vertex
in vec2 a_position;

// per instance
in vec4 a_pos_width_height;
in vec4 a_texCoords0;

// uniforms
uniform mat4 u_projTrans;
uniform vec2 u_offset;

// outputs
out vec2 v_texCoords;

void main()
{
	vec2 vertexPos = a_position;

	vec2 halfSize = a_pos_width_height.zw * 0.5;
	vec2 worldPos = vertexPos * halfSize + a_pos_width_height.xy;
	vec2 basePos = a_pos_width_height.xy - vec2(0.0, halfSize.y * 0.8);
	vec4 viewPos = vec4(worldPos.xy + u_offset, 0.0, 1.0);
	vec4 screenPos = u_projTrans * viewPos;

	vec2 texCoordAlpha = (vertexPos + 1.0) / 2.0;
	v_texCoords = mix(a_texCoords0.xy, a_texCoords0.zw, texCoordAlpha);

	gl_Position = screenPos;
}