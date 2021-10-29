attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_projTrans;

varying vec4 v_color;
varying vec2 v_pos;

void main()
{
	v_color = a_color;

	v_pos = a_position.xy;

	gl_Position = u_projTrans * a_position;
}