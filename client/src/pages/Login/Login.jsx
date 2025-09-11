// import React, { useState } from "react";
import { Imagotipo1 } from "../../assets/svg/Imagotipo1";
import { LoginForm } from "./LoginForm/LoginForm";

export const Login = () => {

    return (
        <>
            <div className="w-full h-screen max-w-[1440px] m-auto bg-login bg-cover bg-center flex flex-col justify-center items-center">
                <section className="w-11/12 min-w-[310px] max-w-[700px] overflow-auto bg-gradient-to-br from-white/50 to-white/20 border border-white/60 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] backdrop-blur-3xl flex flex-col items-center py-5 gap-4 rounded-2xl"> 
                    <Imagotipo1/>
                    <div className="font-Montserrat font-bold text-primary_text text-xl">
                        Log In to your Account
                    </div>
                    <LoginForm />
                    <div className="flex flex-col items-center">
                        <span className="text-white_text/60 font-Opensans font-normal text-xs">{`Don't you have an account?`}</span>
                        <a href="/register" target="_parent" className="text-white_text font-Lora font-bold hover:opacity-55">Sign Up</a>
                    </div>
                </section>
            </div>
        </>

    );
}
        
  
