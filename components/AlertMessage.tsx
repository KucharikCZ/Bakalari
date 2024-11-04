import Swal,{SweetAlertIcon} from "sweetalert2";

export function AlertMessage(type:SweetAlertIcon,message:string){
    switch(type){
        case "success":
            Swal.fire({
                icon: "success",
                title: "Úspěch!",
                text: message,
                timer: 2000,
                showCloseButton: false,
                showConfirmButton: false,
                showDenyButton: false
            });
        return;
        case "error":
            Swal.fire({
                icon: "error",
                title: "Chyba!",
                text: message,
                timer: 2000,
                showCloseButton: false,
                showConfirmButton: false,
                showDenyButton: false
            });
        return;
    }
}