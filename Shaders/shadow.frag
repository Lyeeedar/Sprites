#version 300 es
#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

in mediump vec2 v_texCoords;

uniform sampler2D u_texture;
uniform lowp vec3 u_colour;

out lowp vec4 fragColour;

// ------------------------------------------------------
void main()
{
	lowp float texAlpha = texture(u_texture, v_texCoords).a;
	fragColour = vec4(u_colour * 0.5, texAlpha);
}