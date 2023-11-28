const pname = document.getElementById('pname')
  const category = document.getElementById('categDropdown')
  const description = document.getElementById('description')
  const brand = document.getElementById('brand')
  const mrp = document.getElementById('mrp')
  const price = document.getElementById('price')
  const color = document.getElementById('color')
  const quantity = document.getElementById('quantity')
  const img_input = document.getElementById('img-input')



  document.getElementById('pdt-form').addEventListener('submit',function(e){
    let flag=0;

    if(pname.value==='' || pname.value===null){
      flag=1;
      document.getElementById('name-error').innerHTML='Name is required';
    }
    if(category.value==='' || category.value===null){
      flag=1;
      document.getElementById('category-error').innerHTML='Category is required';
    }
    if(description.value==='' || description.value===null){
      flag=1;
      document.getElementById('description-error').innerHTML='Description is required';
    }
    if(brand.value==='' || brand.value===null){
      flag=1;
      document.getElementById('brand-error').innerHTML='Brand is required';
    }
    if(mrp.value==='' || mrp.value===null){
      flag=1;
      document.getElementById('mrp-error').innerHTML='MRP is required';
    }
    if(price.value==='' || price.value===null){
      flag=1;
      document.getElementById('price-error').innerHTML='Price is required';
    }
    if(color.value==='' || color.value===null){
      flag=1;
      document.getElementById('color-error').innerHTML='Color is required';
    }
    if(quantity.value==='' || quantity.value===null){
      flag=1;
      document.getElementById('quantity-error').innerHTML='Quantity is required';
    }
    if(img_input.value==='' || img_input.value===null){
      flag=1;
      document.getElementById('image-error').innerHTML='Image is required';
    }

     if(flag==1){
      e.preventDefault();
     }

    

  })

  pname.addEventListener('keyup',()=>{
    document.getElementById('name-error').innerHTML=""
  })
  category.addEventListener('keyup',()=>{
    document.getElementById('category-error').innerHTML=""
  })
  description.addEventListener('keyup',()=>{
    document.getElementById('description-error').innerHTML=""
  })
  brand.addEventListener('keyup',()=>{
    document.getElementById('brand-error').innerHTML=""
  })
  
  mrp.addEventListener('keyup',()=>{
    document.getElementById('mrp-error').innerHTML=""
  })
  price.addEventListener('keyup',()=>{
    document.getElementById('price-error').innerHTML=""
  })
  color.addEventListener('keyup',()=>{
    document.getElementById('color-error').innerHTML=""
  })
  quantity.addEventListener('keyup',()=>{
    document.getElementById('quantity-error').innerHTML=""
  })
  img_input.addEventListener('change',()=>{
    document.getElementById('image-error').innerHTML=""
  })
  



document.getElementById('price').addEventListener('keyup',function(){
    const mrp = document.getElementById('mrp').value;
    const price = document.getElementById('price').value;
    let dis=((Number(mrp)-Number(price))/Number(mrp))*100;
    dis=Math.floor(dis);
    document.getElementById('discount').value=dis;
    console.log(dis);
    
})
document.getElementById('img-input').addEventListener('change', function (e) {

  const files = e.target.files;
  const maxFiles = 4;

  if (files.length > maxFiles) {
    // alert(`Please select up to ${maxFiles} files.`);
    document.getElementById('image-error').innerHTML='Please select up to 4 files';
    e.target.value = '';
  }
});


quantity=document.getElementById('quantity').value;

if(quantity<=0 || quantity==null){
    document.getElementById('quantity').value=1;
}



  