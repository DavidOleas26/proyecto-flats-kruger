/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'register': "url('/src/assets/Img/register.jpg')",
        'register-form': "url('/src/assets/Img/register-form.jpg')",
        'register-bg': "url('/src/assets/Img/register-bg.jpg')",
        'login': "url('/src/assets/Img/login.jpg')",
        'newflat': "url('/src/assets/Img/newFlat.jpg')",
        'editflat': "url('/src/assets/Img/editFlat.jpg')",
        'profile': "url('/src/assets/Img/profile.jpg')"
      },
      backgroundColor:({ theme }) => ({
        ...theme('colors'),
        'bg_color_primary': '#F7F6F5',
        'bg_color_footer': '#EAEAE9',
        'bg_color_hoover': '#EBEBEB',
        'primary_color': '#F26018',
        'secondary_color': '#114B5F',
        'success_color': '#3CD85B',
        'info_color': '#008EF4',
        'warning_color': "#FCAE3A",
        'danger_color': '#FC4C49',
      }),
      textColor: ({theme}) => ({
        ...theme('colors'),
        'primary_text': '#222222',
        'secondary_text': '#7D7C83',
        'white_text': '#EFEFF0',
        'text_danger': '#FC4C49',
        'text-primary-color': '#F26018',
      }),
      fontFamily: {
        Montserrat:['"Montserrat"'],
        Lora:['Lora'],
        Opensans: ['"Open Sans"']
      },
    },
  },
  plugins: [],
}

