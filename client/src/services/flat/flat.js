import { db } from '../firebase/firebase.js'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'

export class FlatService  {
    constructor() {

    }

    async createFlat(flat) {
        const flatsCollectionRef = collection(db, "Flats");
        try {
            const result = await addDoc(flatsCollectionRef, flat);
            return {data:{...flat, id:result.id}, message: 'flat created successfully'}
        }catch(error) {
            return {data: null, message: 'Error creating flat' };
        }
    }

    async getFlatbyId(flatId) {
        try{
            const flatDocRef = doc(db, 'Flats', flatId);
            const result = await getDoc(flatDocRef);

            if(!result.exists()) {
                return { data: null, message: `Flat with ID ${flatId} not found` };
            }
            
            return {data: { ...result.data(), id: flatId }};

        }catch(error){
            return { data: null, message: 'Error retrieving Flat', error };
        }
    }

    async updateFlat(flat, flatId) {
        const flatDocRef = doc(db, 'Flats', flatId);

        try{
            const result = await updateDoc(flatDocRef, flat);
            return {data:{...flat}, message: 'flat updated successfully'};

        }catch(error) {
            return {data: null, message: 'Error creating flat' };
        }
    }

    async getFlats (filters , sortBy = 'city', sortOrder = 'asc') {
        const flatsCollectionRef = collection(db, 'Flats');
        const conditions = [];

        if (filters.city !== null) {
            const startText = filters.city;
            const endText = filters.city + '\uf8ff';
            conditions.push(where("city", ">=", startText));
            conditions.push(where("city", "<=", endText));
        }
        if (filters.minPrice !== null) {
            conditions.push(where("rentPrice", ">=", filters.minPrice));
        }
        if (filters.maxPrice !== null) {
            conditions.push(where("rentPrice", "<=", filters.maxPrice));
        }
        if (filters.minArea !== null) {
            conditions.push(where("area", ">=", filters.minArea));
        }
        if (filters.maxArea !== null) {
            conditions.push(where("area", "<=", filters.maxArea));
        }

        conditions.push(orderBy(sortBy, sortOrder));
        
        const setQuery = query(flatsCollectionRef, ...conditions);

        try{
            const resultQuery = await getDocs(setQuery);
            const flats = resultQuery.docs.map((doc)=>({...doc.data(), id:doc.id}));
            return {data: flats, message:'flats gotten successfully'}
        }catch(error){
            return {data: null, message: 'Error getting flats' };
        }
    }

    async getAllFlats () {
        const flatsCollectionRef = collection(db, 'Flats');
        const setQuery = query(flatsCollectionRef);
        try{
            const resultQuery = await getDocs(setQuery);
            const flats = resultQuery.docs.map((doc)=>({...doc.data(), id:doc.id}));
            return {data: flats, message:'flats gotten successfully'}
        }catch(error){
            return {data: null, message: 'Error getting flats' };
        }
    }

    async getMyFlats (userLoggedId) {
        const myflatsCollectionRef = collection(db, 'Flats')
        const setQuery = query(myflatsCollectionRef, where("createdBy", "==", userLoggedId ))
        try{
            const resultQuery = await getDocs(setQuery);
            const flats = resultQuery.docs.map((flat)=>({...flat.data(), id:flat.id}));
            return {data: flats, message: 'flats gotten successfully'}
        }catch( error ){
            return {data: null, message: 'error getting flats'}
        }
    }   

    async getFavoriteFlats(userLoggedId) {
        const favoritesFlatsCollectionRef = collection(db, 'FavoriteFlats');
        const setQuery = query(favoritesFlatsCollectionRef, where("userLoggedId", "==", userLoggedId));

        try{
            const queryResult = await getDocs(setQuery);

            if (queryResult.empty) {
                console.log('empty')
                return { data: [], message: 'No favorite Flats' };
            }

            const flatsIds = queryResult.docs.map((flat)=> flat.data().flatId);
            
            const flats = await Promise.all(flatsIds.map((flatId)=> this.getFlatbyId(flatId)));
            const validFlats = flats.filter(flat => flat.data !== null);
            return { data: validFlats, message: 'Favorite Flats retrieved successfully' };

        }catch (error){
            return {data: null, message: 'Error founding Favorite Flats' };
        }
    }

    async checkFavoriteFlat({ flatId, userLogged }) {
        const favoritesFlatsCollectionRef = collection(db, 'FavoriteFlats');
        const setQuery = query(favoritesFlatsCollectionRef, where("flatId", "==", flatId), where("userLoggedId", "==", userLogged));
 
        const queryResult = await getDocs(setQuery);
        if ( !queryResult.empty ) {
            const result = queryResult.docs[0].data();
            return {data: result, message: 'flat found'};
        }else {
            return {data: null, message: 'flat didnt found' };
        }
    }

    async addFavoriteFlat (favoriteFlat) {
        const favoritesFlatsCollectionRef = collection(db, 'FavoriteFlats');
        try{
            const result = addDoc(favoritesFlatsCollectionRef, favoriteFlat);
            return {data: {...favoriteFlat, id: result.id}}
        }catch(error){
            return {data: null, message: 'Error adding favorite flat' };
        }
    }

    async removeFavoriteFlat ({ flatId, userLoggedId }) {
        const favoritesFlatsCollectionRef = collection(db, 'FavoriteFlats');
        const setQuery = query(favoritesFlatsCollectionRef, where("flatId", "==", flatId), where("userLoggedId", "==", userLoggedId)); 
        const queryResult = await getDocs(setQuery);
        
        if(!queryResult.empty){
            const docRef = queryResult.docs[0].ref
            await deleteDoc(docRef);
            return { data: null, message: 'Flat removed from favorites' };
        }else {
            return { data: null, message: 'Flat not found in favorites' };
        }
    }

    async deleteFlat (flatId) {
        try{
            const flatDocRef = doc(db, 'Flats', flatId);
            const result = await getDoc(flatDocRef);

            if(!result.exists()) {
                return { data: null, message: `Flat with ID ${flatId} not found` };
            }

            await deleteDoc(flatDocRef)
            return { data: true, message: `Flat with ID ${flatId} deleted successfully` };

        }catch(error) {
            return { data: null, message: 'Error retrieving Flat', error };
        }   

    }

    async deleteUserFlats(userId) {
        try {
            const flatsCollectionRef = collection(db, "Flats");
            const setQuery = query(flatsCollectionRef, where("createdBy", "==", userId));
            const querySnapshot = await getDocs(setQuery);
    
            const deletePromises = querySnapshot.docs.map(async (flatDoc) => {
                await deleteDoc(doc(db, "Flats", flatDoc.id));
            });
    
            await Promise.all(deletePromises); // Esperar a que todas las eliminaciones terminen
    
            return { success: true, message: "User's flats deleted successfully" };
        } catch (error) {
            console.error("Error deleting user's flats:", error);
            return { success: false, message: "Error deleting user's flats" };
        }
    }

}

