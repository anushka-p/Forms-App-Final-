import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import jwtDecode from "jwt-decode";
export const IsAuthGuard : CanActivateFn = (route,state)=>{
    const token = localStorage.getItem('token');
    const router = inject(Router);
    if(token)
    {
        const decoded: any = jwtDecode(token);
        if(decoded.role === 'admin')
        {
            return true;
        }
        else if(decoded.role === 'user'){
            // router.navigate(['home/user-home']);
            return true;
        }
        else{
            return false;
        }
       
    }
    else{
        router.navigate(['']);
        return false;
    }
}