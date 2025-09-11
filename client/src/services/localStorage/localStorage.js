export class LocalStorageService { 

    constructor() {
        
    }

    getLoggedUser(){
        return JSON.parse(localStorage.getItem('user'));
    }

    getUserToken () {
        return localStorage.getItem('token')
    }

    updateLoggedUser(user) {
        if(this.getLoggedUser().id === user.id) {
            localStorage.setItem('userLogged', JSON.stringify(user));
        }
    }

    checkLoggedUser(){
        const user = localStorage.getItem('user');
        return user ? true : false;
    }
}