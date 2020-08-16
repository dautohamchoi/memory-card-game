function setNameLevel(level) {
    switch(level) {
        case 1:
            return "Đồng V";
        case 2: 
            return "Đồng IV";  
        case 3:
            return "Đồng III";
        case 4: 
            return "Đồng II";
        case 5:
            return  "Đồng I";
        case 6:
            return "Bạc V";   
        case 7: 
            return "Bạc IV";  
        case 8:
            return "Bạc III";
        case 9: 
            return "Bạc II";
        case 10:
            return  "Bạc I";
        case 11:
            return "Vàng V";     
        case 12: 
            return "Vàng IV";  
        case 13:
            return "Vàng III";
        case 14: 
            return "Vàng II";
        case 15:
            return  "Vàng I";
        case 16:
            return "Bạch Kim V"; 
        case 17: 
            return "Bạch Kim IV";  
        case 18:
            return "Bạch Kim III";
        case 19: 
            return "Bạch Kim II";
        case 20:
            return "Bạch Kim I";
        case 21:
            return "Kim Cương V";    
        case 22: 
            return "Kim Cương IV";  
        case 23:
            return "Kim Cương III";
        case 24: 
            return "Kim Cương II";
        case 25:
            return "Kim Cương I";                                                           
        default:
            return "Sắt I";    
    }
}

export default setNameLevel;