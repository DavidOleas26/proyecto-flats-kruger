// IMagen svg logo
import { Imagotipo1 } from "../../assets/svg/Imagotipo1"
// componente formulario
import { UserForm } from "../../components/UserForm/UserForm"

export const Register = () => {
    return(
        <>
            <div className=" max-w-[1440px] m-auto md:flex">
                <div className="w-full md:max-w-[500px] h-screen m-auto md:flex md:flex-1 md:justify-center md:items-center md:rounded-r-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-register-form bg-center bg-cover blur-[1px]"></div>
                    {/* <div className="hidden md:flex md:flex-col md:items-center md:gap-4 relative z-10">
                        <span className="text-white_text font-Montserrat font-bold text-4xl tracking-wide">WELCOME</span>
                        <p className="w-3/4 text-center text-white_text/70 font-Lora font-bold">
                            Please enter your details to sign up and be part of our great community
                        </p>
                        <span className="mt-8 font-Opensans font-normal text-sm text-primary_text">
                            Already have an Account?
                        </span>
                        <a href="/login" target="_parent" rel="noopener noreferrer" className="text-primary_text border rounded-md px-8 py-1 bg-white/60 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">Sign In</a>
                    </div> */}
                </div>
                <div className="absolute inset-0 flex justify-center items-center md:static md:flex-1 md:bg-register-bg md:bg-cover md:bg-center">
                    <section className="w-11/12 min-w-[310px] max-w-[700px] max-h-[95vh] overflow-hidden hover:overflow-auto bg-gradient-to-br from-white/50 to-white/20 border border-white/60 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] backdrop-blur-3xl flex flex-col items-center py-5 gap-4 rounded-2xl">
                        <Imagotipo1 />
                        <span className="font-Montserrat font-bold text-primary_text text-xl"> Create an account </span>
                        <UserForm />
                        <div className="flex flex-col items-center">
                            <span className="font-Opensans font-normal text-xs text-primary_text">Already have an Account?</span>
                            <a href="/" target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:opacity-55 text-primary_text">Sign In</a>
                        </div>
                    </section>
                </div>
                
            </div>
        </>
    )
}      
