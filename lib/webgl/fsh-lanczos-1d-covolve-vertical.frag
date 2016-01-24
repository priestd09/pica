precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform vec2 u_imageSize;
uniform float u_winSize;

varying vec2 v_texCoord;

#define sinc(a) (sin(a)/a)
#define M_PI 3.1415926535897932384626433832795

void main() {
  vec2 pixel = vec2(1.) / u_imageSize;
  gl_FragColor = vec4(0.);

//  gl_FragColor = texture2D(u_image, v_texCoord);
//  float a = gl_FragColor.x;
  float total = 0.;
  float scale = u_imageSize.y / u_resolution.y;
  float count = u_winSize * scale * 2.;
  for (int i = 0; i < 1024*8; i++) {
    if (float(i) >= count) {
      break;
    }
    float k = float(i) - (count / 2.);
    vec2 offset = vec2(0., pixel.y * k);
    vec4 c = texture2D(u_image, v_texCoord+offset);
    if (v_texCoord.x+offset.x < 0. || v_texCoord.x+offset.x > 1. ||
      v_texCoord.y+offset.y < 0. || v_texCoord.y+offset.y > 1.) {
      c = vec4(0.);
    }
    float x = k / scale; // max [-3, 3]
    float xpi = x * M_PI;
    float b = sinc(xpi) * sinc(xpi / u_winSize);
    if (x > -1.19209290E-07 && x < 1.19209290E-07) { 
      b = 1.;
    }
    total += b;
    c *= vec4(vec3(b), 1.);
    //c += vec4(b);
    gl_FragColor += c;
//    gl_FragColor += 0.01; //vec4(sin(a*10.))*1;
  }
  gl_FragColor /= vec4(vec3(total), 1.);
//  gl_FragColor /= vec4(vec3(count), 1.);
//  gl_FragColor = vec4(vec3(total), 1.);
}