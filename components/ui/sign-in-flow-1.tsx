"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ChevronRight, Mail, Lock, Eye, EyeOff, Building, Globe, User, Link2 } from "lucide-react";
import { UprisingMascot } from "@/components/ui/uprising-mascot";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.819-.26.819-.578 0-.284-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.509 11.509 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.096.823 2.201 0 1.59-.016 2.871-.016 3.257 0 .319.214.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}
      
export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[255, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, 
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean; 
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[255, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", 
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0, 
        type: "uniform1i", 
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]); 

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse; 

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2); 
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5; 
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a; 
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};


const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }; 
    return preparedUniforms;
  };

  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "code" | "success">("form");
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      if (authMode === "otp") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: authType === "signup",
            data: authType === "signup" ? {
              full_name: fullName,
              company_name: companyName,
              company_website: companyWebsite,
            } : undefined,
          },
        });
        if (error) throw error;
        setStep("code");
        toast.success("Code ou lien envoyé à " + email);
      } else {
        if (authType === "signup") {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                company_name: companyName,
                company_website: companyWebsite,
              }
            }
          });
          if (error) throw error;
          toast.success("Compte créé ! Vérifiez vos courriels pour confirmer.");
          setAuthType("login");
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          setReverseCanvasVisible(true);
          setTimeout(() => setInitialCanvasVisible(false), 50);
          setTimeout(() => setStep("success"), 2000);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    
    if (error) {
      toast.error(error.message);
      return;
    }

    if (data?.url) {
      window.open(data.url, "_blank", "noopener,noreferrer");
      toast.info("Connexion en cours dans un nouvel onglet...");
    }
  };

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const verifyCode = async (currentCode: string[]) => {
    const token = currentCode.join("");
    if (token.length !== 6) return;

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setReverseCanvasVisible(true);
      setTimeout(() => setInitialCanvasVisible(false), 50);
      setTimeout(() => setStep("success"), 2000);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      if (index === 5 && value) {
        verifyCode(newCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("form");
    setCode(["", "", "", "", "", ""]);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-black relative overflow-hidden", className)}>
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>
      
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div 
                key="form-step"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-6">
                  <div className="flex justify-center mb-8">
                    <UprisingMascot size={160} className="text-white" state={step === "form" ? "idle" : step === "code" ? "active" : "success"} />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Uprising Anarchy</h1>
                    <p className="text-lg text-white/70 font-light italic">L'outreach à vitesse terminale</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleOAuthLogin("google")}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-2.5 px-4 transition-colors text-sm"
                    >
                      <GoogleIcon />
                      <span>Google</span>
                    </button>
                    <button 
                      onClick={() => handleOAuthLogin("github")}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-2.5 px-4 transition-colors text-sm"
                    >
                      <GitHubIcon />
                      <span>GitHub</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.2em]">ou via {authMode === "otp" ? "courriel" : "mot de passe"}</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  
                  <form onSubmit={handleAuth} className="space-y-3">
                    {authType === "signup" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <User className="w-4 h-4" />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Nom complet"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-white/30 transition-all"
                            required={authType === "signup"}
                            disabled={loading}
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <Building className="w-4 h-4" />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Nom de l'entreprise"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-white/30 transition-all"
                            required={authType === "signup"}
                            disabled={loading}
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <Link2 className="w-4 h-4" />
                          </div>
                          <input 
                            type="url" 
                            placeholder="Site web de l'entreprise"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-white/30 transition-all"
                            required={authType === "signup"}
                            disabled={loading}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="nom@agence.ca"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-white/30 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>

                    {authMode === "password" && (
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 pl-11 pr-12 focus:outline-none focus:border-white/30 transition-all font-mono"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all active:scale-[0.98]"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{authType === "login" ? "Se connecter" : "S'inscrire"}</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-center gap-4 text-[11px]">
                      <button
                        onClick={() => setAuthMode(authMode === "otp" ? "password" : "otp")}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        Utiliser {authMode === "otp" ? "un mot de passe" : "un lien magique"}
                      </button>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <button
                        onClick={() => setAuthType(authType === "login" ? "signup" : "login")}
                        className="text-white/40 hover:text-white transition-colors uppercase tracking-wider font-bold"
                      >
                        {authType === "login" ? "Créer un compte" : "Déjà membre ?"}
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] text-white/40 pt-8 max-w-xs mx-auto">
                  En continuant, vous acceptez nos <Link href="#" className="underline hover:text-white/60">Conditions d'utilisation</Link> et notre <Link href="#" className="underline hover:text-white/60">Politique de confidentialité</Link>.
                </p>
              </motion.div>
            ) : step === "code" ? (
              <motion.div 
                key="code-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-6">
                  <div className="flex justify-center mb-4">
                    <UprisingMascot size={80} state="active" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Code de sécurité</h1>
                    <p className="text-sm text-white/50">Envoyé sur {email}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  {code.map((digit, i) => (
                    <div key={i} className="relative">
                      <input
                        ref={(el) => { codeInputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-10 h-14 text-center text-2xl font-mono bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-white/30"
                        style={{ caretColor: 'transparent' }}
                      />
                      {!digit && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <span className="text-xl text-white">0</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={handleBackClick}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Retour à l'email
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-6">
                  <div className="flex justify-center mb-4">
                    <UprisingMascot size={120} state="success" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white">Accès accordé</h1>
                    <p className="text-white/50">Redirection vers le cockpit...</p>
                  </div>
                </div>
                
                <div className="py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <Link 
                  href="/prospection"
                  className="inline-block w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition-all transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Entrer maintenant
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
