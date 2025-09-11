import axios from "axios";

export class ImagesService {
    constructor() {
        
    }
    
    async converImageRandom () {
        const access_key = process.env.REACT_APP_UNSPLASH_APP_ID;
        try{ 
            const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${access_key}&orientation=landscape&count=1&query=city`)
            return response.data[0].urls.regular;
        }catch(error){
            console.error(error);
            return null;
        }
    }

    async profileImage () {
        try{
            const response = await axios.get(`https://randomuser.me/api/`);
            return response.data.results[0].picture.large
        }catch (error) {
            return null;
        }
    }

    async review () {
        try{
            const response = await axios.get('https://dummyjson.com/comments?limit=5&select=body,postId');
            return response.data.comments;
        }catch(error){
            return null;
        }
    }
}

