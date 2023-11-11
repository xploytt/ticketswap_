
const d = document
const maxTix = Number(d.getElementById('max-quantity').textContent)
const proceedBtn = d.querySelector('#buy-tix-btn > button')
const log = console.log
const faqsBtns = [...d.querySelectorAll('.faqs-arrow')]
const faqs = [...d.querySelectorAll('#faqs-questions > li')]

faqsBtns.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let listEl = e.target.closest('li')
        closefaqs(listEl)
        listEl.dataset.view == 'closed' ? listEl.dataset.view = '' : 
        listEl.dataset.view = 'closed'

    })
})

function closefaqs(el){
    faqs.filter(faq => faq != el).forEach((faq)=>{
        faq.dataset.view = 'closed'
    })
}


proceedBtn.addEventListener('click', async ()=>{
    // i could have written this better - made use of es6 map method and [] to get hold of the input names

    
    let loadingGif = d.getElementById('loading-gif')
    loadingGif.dataset.hidden = ''
    let form = d.getElementById('foot-form')
    let datetime = form.querySelector('input[name="dt"]')
    let numOfTix = form.querySelector('input[name="num_of_tix"]')
    let evtName = form.querySelector('input[name="event_name"]')
    let price = form.querySelector('input[name="price"]')
    let uidInput = form.querySelector('input[name="uid"]')

    
    const parsedUrl = new URL(window.location.href);
    const uid = parsedUrl.searchParams.get("uid"); 


    let evtLocationValue = d.getElementById('evt-date-time').textContent.split('').reverse().slice(10).reverse().join("")
    datetime.value = `${evtLocationValue} • ${d.getElementById('evt-location').textContent}`
    numOfTix.value = d.getElementById('quantity-of-tx').textContent
    evtName.value = d.getElementById('event_name').textContent
    price.value = d.querySelector('#pricing-detail > span').textContent
    uidInput.value = uid
    setTimeout(()=> loadingGif.dataset.hidden = 'true',  6000)
    setTimeout(()=> form.submit(), 2000)
})

let btns = d.querySelectorAll('button.minus-plus')
Array.from(btns).forEach((btn)=> btn.addEventListener('click', function(){
    switch(this.id){
        case 'minus-btn':
            minusQuantity()
            break
        case 'plus-btn':
            addQuantity()
            break
        default:
            return
    }
}))

let quantityPurchasedEl = d.getElementById('quantity-of-tx')
let quantityPurchased = Number(quantityPurchasedEl.textContent)
let evtPriceEl = d.querySelector('#pricing-detail > span:first-child')
let evtPrice = parseFloat(evtPriceEl.textContent.replace('$', ''))
const fixedEvtPrice = evtPrice

function minusQuantity(){
    if (quantityPurchased === 1){
        return
    }else{
        quantityPurchased -=1
        quantityPurchasedEl.textContent = quantityPurchased
        evtPrice = evtPrice - fixedEvtPrice
        evtPriceEl.textContent = `$${evtPrice}`
    }
}
function addQuantity(){
    if (quantityPurchased === maxTix){
        return
    }else{
        quantityPurchased +=1
        quantityPurchasedEl.textContent = quantityPurchased
        evtPrice = evtPrice + fixedEvtPrice
        evtPriceEl.textContent = `$${evtPrice}`
    }
}


