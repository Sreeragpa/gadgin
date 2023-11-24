document.getElementById('price').addEventListener('keyup',function(){
    const mrp = document.getElementById('mrp').value;
    const price = document.getElementById('price').value;
    let dis=((Number(mrp)-Number(price))/Number(mrp))*100;
    dis=Math.floor(dis);
    document.getElementById('discount').value=dis;
    console.log(dis);
    
})

quantity=document.getElementById('quantity').value;

if(quantity<=0 || quantity==null){
    document.getElementById('quantity').value=1;
}


document.getElementById('img-input').addEventListener('change', function (e) {

    const files = e.target.files;
    const maxFiles = 4;

    if (files.length > maxFiles) {
      alert(`Please select up to ${maxFiles} files.`);
      e.target.value = '';
    }
  });