function aplicandoMascara() {
    const cpfFields = document.querySelectorAll('.cpf-mask');
        cpfFields.forEach(field => {
        field.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if(value.length > 3 && value.length <=6){

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        }else if(value.length > 6 && value.length <= 9){
        value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
        }else if(value.length > 9){
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        }
                                                                                                                                    
        e.target.value = value.substring(0, 14);

        });
       });

       const phoneFields = document.querySelectorAll('.phone-mask');
        phoneFields.forEach(field =>{
        field.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
         if(value.length > 2 && value.length <= 6){
          value = value.replace(/(\d{2})(\d)/ ,'($1) $2');

        } else if(value.length > 6 && value.length <= 10){
         value = value.replace(/(\d{2}) (\d{4}) (\d)/, '($1) $2-$3');
                                                                                                                                                                                                                                                            
        } else if(value.length > 10){
        value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
                                                                                                                                                                                                                                                                                                    
        }

        e.target.value = value.substring(0,15);
         });
    });
}
                                                                                                                                                                                                                                                                                                                                        
document.addEventListener('DOMContentLoaded', aplicandoMascara)