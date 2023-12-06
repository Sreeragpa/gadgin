
callme()
document.querySelectorAll('#quantity').forEach(element => {
    element.addEventListener('change',callme)
});

function callme(){
    let price=0;  
    let mrp=0; 
    let discount=0; 
    let count=0; 
    document.querySelectorAll('#quantity').forEach((element,index)=>{
        for(let i=0;i<Number(element.value);i++){
            const priceElement = document.querySelectorAll('#price');
            price += Number(priceElement[index].value);
            const mrpElement = document.querySelectorAll('#mrp');
            mrp += Number(mrpElement[index].value);
            
          
            count++;
        }
        const discountElement = document.querySelectorAll('#discountp');
        discount+= Number(discountElement[index].value)
    })
    document.getElementById('totalmrp').innerHTML = mrp;
    document.getElementById('discount').innerHTML = mrp-price;
    // document.getElementById('discountpercentage').innerHTML = discount;
    document.getElementById('total').innerHTML = price;
    document.getElementById('count').innerHTML = count;

}
