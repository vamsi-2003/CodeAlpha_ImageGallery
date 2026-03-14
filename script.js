// DOM References
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightboxImg");
const lightboxCaption=document.getElementById("lightboxCaption");
const closeBtn=document.getElementById("lightboxClose");
const prevBtn=document.getElementById("lightboxPrev");
const nextBtn=document.getElementById("lightboxNext");

const uploadForm=document.getElementById("uploadForm");
const uploadFile=document.getElementById("uploadFile");
const uploadCategory=document.getElementById("uploadCategory");

const filterBtns=document.querySelectorAll(".filter-btn");

let galleryItems=[];
let galleryImages=[];
let currentIndex=0;

// Initialize gallery
function init(){
  galleryItems=[...document.querySelectorAll(".gallery-item")];
  galleryImages=galleryItems.map(item=>item.querySelector("img"));
  galleryItems.forEach((item,i)=>{
    item.addEventListener("click",()=>openLightbox(i));
  });
}

// Lightbox functions
function openLightbox(i){
  currentIndex=i;
  const img=galleryImages[i];
  lightboxImg.src=img.src;
  lightboxCaption.innerText=img.alt;
  lightbox.classList.add("show");
}

function closeLightbox(){lightbox.classList.remove("show");}
function showNext(){openLightbox((currentIndex+1)%galleryImages.length);}
function showPrev(){openLightbox((currentIndex-1+galleryImages.length)%galleryImages.length);}

closeBtn.onclick=closeLightbox;
nextBtn.onclick=e=>{e.stopPropagation();showNext();}
prevBtn.onclick=e=>{e.stopPropagation();showPrev();}
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox();};

document.onkeydown=e=>{
  if(!lightbox.classList.contains("show"))return;
  if(e.key==="Escape")closeLightbox();
  if(e.key==="ArrowRight")showNext();
  if(e.key==="ArrowLeft")showPrev();
};

// Filter Logic
filterBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const filter=btn.dataset.filter;

    galleryItems.forEach(item=>{
      item.classList.toggle("hide", filter!=="all" && item.dataset.category!==filter);
    });
  });
});

// Upload Logic
uploadForm.addEventListener("submit",e=>{
  e.preventDefault();
  const file=uploadFile.files[0];
  if(!file)return;

  const reader=new FileReader();
  reader.onload=e=>{
    addImage(e.target.result,uploadCategory.value);
    uploadFile.value="";
  };
  reader.readAsDataURL(file);
});

function addImage(src,category){
  const gallery=document.querySelector(".gallery");

  const div=document.createElement("div");
  div.className="gallery-item";
  div.dataset.category=category;

  const img=document.createElement("img");
  img.src=src;
  img.alt=`${category} (Uploaded)`;

  div.appendChild(img);
  gallery.appendChild(div);

  // Add to gallery arrays
  galleryItems.push(div);
  galleryImages.push(img);

  div.addEventListener("click",()=>{
    openLightbox(galleryImages.indexOf(img));
  });

  // Respect current filter
  const active=document.querySelector(".filter-btn.active").dataset.filter;
  if(active!=="all" && active!==category){
    div.classList.add("hide");
  }
}

init();
