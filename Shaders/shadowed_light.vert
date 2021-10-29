#version 300 es

// per vertex
in vec4 a_position;

// per instance
in vec4 a_pos_range_brightness;
in vec4 a_color;
in vec2 a_region_offset_count;

// uniforms
uniform mat4 u_projTrans;
uniform vec2 u_offset;

// outputs
out vec4 v_color;
out vec2 v_lightPos;
out vec2 v_pixelPos;
out float v_lightRange;
out float v_brightness;
out vec2 v_region_offset_count;

void main()
{
	v_color = a_color;

	vec2 worldPos = a_position.xy * a_pos_range_brightness.z + a_pos_range_brightness.xy;
	vec4 viewPos = vec4(worldPos.xy + u_offset, 0.0, 1.0);

	v_pixelPos = worldPos;
	v_lightPos = a_pos_range_brightness.xy;

	v_lightRange = a_pos_range_brightness.z;
	v_brightness = a_pos_range_brightness.w;

	v_region_offset_count = a_region_offset_count;

	gl_Position = u_projTrans * viewPos;
}