
  const mrp = document.getElementById('mrp')
  const price = document.getElementById('price')
  const savedImg = document.getElementById('img-length')

    
  document.getElementById('pdt-form').addEventListener('submit',function(e){
    const saveimglength = Number(savedImg.dataset.imglength);
    const imginputt = document.getElementById('img-input');
    const file = imginputt.files;
    const totalImg = Number(file.length)+saveimglength;
    let flag=0;
    if(Number(price.value)<0){
      flag=1;
      console.log(Number(price.value));
      document.getElementById('price-error').innerHTML='Price should be greater than zero';
    }
    if(Number(mrp.value)<0){
      flag=1;
      console.log(Number(mrp.value));
      document.getElementById('mrp-error').innerHTML='MRP should be greater than zero';
    }
    
    if(totalImg==0){
      
      flag=1;
      document.getElementById('image-error').innerHTML='Image is required';
    }
    if(quantity.value<0){
      flag=1;
      document.getElementById('quantity-error').innerHTML='Quantity should be greater than zero';
    }

     if(flag==1){
      e.preventDefault();
     }

    

  })

  // imginputt.addEventListener('change',()=>{
  //   document.getElementById('image-error').innerHTML="";
  // })