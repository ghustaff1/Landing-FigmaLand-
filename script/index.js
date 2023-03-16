'use strict';
window.addEventListener('DOMContentLoaded', function(){
//Slider
function makeSlider(sliderWrapper, items, amountInOneSlide){
  const slide=document.createElement('div');
  slide.classList.add('swiper-slide');
  if(amountInOneSlide===1){
    items.forEach(item=>{
      slide.innerHTML=`${item.outerHTML}`;
      sliderWrapper.innerHTML+=slide.outerHTML;
    })
  } else{
    items.forEach((item, i)=>{
      if(i%amountInOneSlide==0 && i!==0){
        sliderWrapper.innerHTML+=slide.outerHTML;
        slide.innerHTML=`${item.outerHTML}`;
       } else if(i===items.length-1){
        slide.innerHTML+=item.outerHTML;
        sliderWrapper.innerHTML+=slide.outerHTML;
       } else{
        slide.innerHTML+=`${item.outerHTML}`;
       }
    });
  }
  
}
function removeSlider(parent){
  parent.innerHTML='';
}
//Header
  //Burger
  const burgerIcon=document.querySelector('.nav__burger-icon'),
        burgerMenu=document.querySelector('.nav-burger__menu');
  burgerIcon.addEventListener('click', (e)=>{
    burgerMenu.classList.toggle('active');
    burgerIcon.classList.toggle('clicked');
  });
  window.addEventListener('scroll', ()=>{
    if(window.scrollY>=document.querySelector('.header').clientHeight){
      burgerIcon.classList.add('change-color');
    } else{
      burgerIcon.classList.remove('change-color');
    }
  });
  closeBurger();
  function closeBurger(){
    const navLinks=document.querySelectorAll('.nav-burger__link');
    navLinks.forEach(navLink=>{
      navLink.addEventListener('click', ()=>{
        burgerMenu.classList.remove('active');
        burgerIcon.classList.remove('clicked');
      })
    })
  }
  //Partners-Slider
  const partnersSwiper = new Swiper('.partners-swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    
  });
  
  //match-media
  window.addEventListener('resize', ()=>{
    if(window.matchMedia("(max-width:650px)").matches){
      makeSlider(partnersSwiperWrapper, partnersItems, 3);
      partnersRow.style.display='none';
    } else{
      partnersRow.style.display='flex';
      removeSlider(partnersSwiperWrapper);
    }
  });

  const partnersSwiperWrapper = document.querySelector('.partners-swiper__wrapper'),
        partnersItems=document.querySelectorAll('.partners-content__item'),
        partnersRow=document.querySelector('.partners-content');

  makeSlider(partnersSwiperWrapper, partnersItems, 3);
  document.querySelector('.partners-content').style.display='none';
  

  //Modal
  const modalMessage={
    failed:'Something went wrong...',
    incorrect:'Please fill in * fields!',
    success:'Thank you, check your e-mail!',
  }
  const openModalBtns=document.querySelectorAll('.modal-btn'),
        modal=document.querySelector('.modal-try'),
        closeModalBtn=document.querySelector('.modal-try__close'),
        resultMessage=document.querySelector('.modal-try__result');
  function openModal(){
    modal.style.top=`${window.scrollY-1}px`;
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  openModalBtns.forEach(openModalBtn=>{
    openModalBtn.addEventListener('click', e=>{
      e.preventDefault();
      openModal();
    })
  })
  // function checkInputs(inputs){ 
  //   let counter=0;
  //   inputs.forEach(input=>{
  //     if(input.value!==''){
  //       counter++;
  //       input.classList.add('incorrect');
  //     }  
  //   });
  //   if(counter===inputs.length){
  //     return true;
  //   }  else{
  //     return false;
  //   }
  // }
  const postData = async (url, data) => {
    let res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });
    return await res.json();
  };
  function resetModal(){
    form.reset();
    resultMessage.className='modal-try__result';
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  const form=document.querySelector('.modal-try__form');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const formData=new FormData(form);
    const json=JSON.stringify(Object.fromEntries(formData.entries()));
      postData('http://localhost:3000/requests', json)
      .then(()=>{
        resultMessage.textContent=modalMessage.success;
        resultMessage.classList.add('success');
      }).catch(()=>{
        resultMessage.textContent=modalMessage.failed;
        resultMessage.classList.add('failed');
      }).finally(()=>{
        setTimeout(()=>{
        resetModal();
        }, 3000);
      });
        
    
  })
  closeModalBtn.addEventListener('click', ()=>{
    resetModal();
  })
  
  //Prices
  const pricesSwiper = new Swiper('.prices-swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    
  });
  const pricesSwiperWrapper=document.querySelector('.prices-swiper__wrapper'),
        pricesItems=document.querySelectorAll('.prices__card'),
        pricesRow=document.querySelector('.prices__row');
  window.addEventListener('resize', ()=>{
    if(window.matchMedia("(max-width:950px)").matches){
      makeSlider(pricesSwiperWrapper, pricesItems, 1);
      pricesRow.style.display='none';
    } else{
      pricesRow.style.display='flex';
      removeSlider(partnersSwiperWrapper);
    }
  });
  
//Subscribe
  const subscribeForm=document.querySelector('.subscribe__form');
  subscribeForm.addEventListener('submit', e=>{
    e.preventDefault();
    const formData= new FormData(subscribeForm);
    const json=JSON.stringify(Object.fromEntries(formData.entries()));
    const subscribeResult=document.createElement('div');
    subscribeResult.classList.add('subscribe__result')
    postData('http://localhost:3000/emails', json)
    .then(()=>{
      subscribeResult.classList.add('success');
      subscribeResult.textContent=modalMessage.success;
      subscribeForm.after(subscribeResult);
    })
    .catch(()=>{
      subscribeResult.classList.add('failed');
      subscribeResult.textContent=modalMessage.failed;
      subscribeForm.after(subscribeResult);
    })
    .finally(()=>{
      setTimeout(()=>{
        subscribeForm.reset();
        subscribeResult.remove();
      }, 3000)
    })
  })

//Contact
  //Form
  const contactFormMessage={
    failed:'Something went wrong...',
    incorrect:'Please fill in fields!',
    success:"Thank you, we'll read your message!",
  }
  const contactForm=document.querySelector('.contact__form'),
        contactFormResult=document.querySelector('.contact-form__result');
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const formData=new FormData(contactForm);
    const json=JSON.stringify(Object.fromEntries(formData.entries()));
    postData('http://localhost:3000/messages', json)
    .then(()=>{
      contactFormResult.classList.add('success');
      contactFormResult.textContent=contactFormMessage.success;
    })
    .catch(()=>{
      contactFormResult.classList.add('failed');
      contactFormResult.textContent=contactFormMessage.failed;
    })
    .finally(()=>{
      setTimeout(()=>{
        contactFormResult.className='contact-form__result';
        contactForm.reset();
      }, 3000)
    })
  })

});