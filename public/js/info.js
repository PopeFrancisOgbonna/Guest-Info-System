const registerGuest = document.querySelector('#guestSubmit');
const addStaff = document.querySelector('#staffRegSubmit');
const warning2 = document.querySelector('#warn');
//Displaying page views on button click
const staff = document.querySelector('#staff');
const guest = document.querySelector('#guest');
const view = document.querySelector('#view');

//Method for toggling class
const removeHide = (input) =>{
    const staffReg = document.querySelector('#staffReg');
    const guestReg = document.querySelector('#guestReg')
    const guestRecord = document.querySelector('#guestRecord');

    staffReg.classList.add('hide');
    guestRecord.classList.add('hide');
    guestReg.classList.add('hide');

    input.classList.remove('hide');
}
//Method to toggle chronicle of Visitors information
const toggleDisplay = (input) =>{
    const table = document.querySelector('#Table');
    const contact = document.querySelector('#contactDetails');
    table.classList.add('hide');
    contact.classList.add('hide');
    input.classList.remove('hide');
} 

staff.addEventListener('click', (e) =>{
    e.preventDefault();
    const staffReg = document.querySelector('#staffReg');
    removeHide(staffReg);
});
guest.addEventListener('click', (e) =>{
    e.preventDefault();
    const guestReg = document.querySelector('#guestReg');
    removeHide(guestReg); 
});
view.addEventListener('click', (e) =>{
    e.preventDefault();
    const guestRecord = document.querySelector('#guestRecord');
    removeHide(guestRecord);
});

//Displaying all Records from the database 
const record = document.querySelector('#allRecord');
//function to automatically generate tabel
const generateTable = (table, data) =>{
    table.innerHTML === '' ? null :table.innerHTML = '';
    table.style.fontSize = '0.8em';
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
       let th = document.createElement('th');
       let text = document.createTextNode(key.toUpperCase());
       th.appendChild(text);
       row.appendChild(th);
    }
}
const generateTableItems = (table, data) =>{
    for (let element of data) {
        let row = table.insertRow();
        for(key in element){
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}
record.addEventListener('click', ()=>{
    fetch('/users',{
        method:'get',
        headers:{'content-type':'application/json'}
    }).then(response=> response.json())
    .then(data =>{
        if(data.length){
            console.log(data);
            warning2.innerHTML ='';
            const table = document.querySelector('#Table');
            const datahead = Object.keys(data[0]);
            
            generateTable(table, datahead);
            generateTableItems(table, data);
            toggleDisplay(table);//Displays the Table information
        }
    })
    .catch(err =>console.log(err)); 
})

//Search specific user
const search = document.querySelector('#search');

search.addEventListener('click',()=>{
    
    const input = document.querySelector('#searchInput').value.trim();
    const table = document.querySelector('#Table');
    table.innerHTML = '';
    let url = '/users/'+input;
     if(input === ''){ 
         toggleDisplay(table);
         warning2.innerHTML ='Error: No Guest Name to search for!';
         warning2.style.color= 'red';
         return;
     }
    fetch(url,{
        method:'get',
        headers:{'content-type':'application/json'}
    }).then(response =>response.json())
    .then(data =>{
        if(data.length){
            warning2.innerHTML= '';
            const datahead = Object.keys(data[0]);
            
            generateTable(table, datahead);
            generateTableItems(table, data);
            toggleDisplay(table);//Displays the Table information
        }else{
            toggleDisplay(table);
            warning2.innerHTML ='Guest No Found!';
            warning2.style.color ='green';
        }
    })
    .catch(err =>console.log(err));
});
//Contacting Guest 
const contact = document.querySelector('#contact');
contact.addEventListener('click', (e) =>{
    e.preventDefault();
    warning2.innerHTML ='';
    const form = document.querySelector('#contactDetails');
    toggleDisplay(form);
});
// Print Information
//function to print document
//this function has a default of disabling the page events once executed
const printDoc = (div) =>{
    var content = div.innerHTML;
    var pageContent = document.body.innerHTML;

    document.body.innerHTML = content;
    window.print();

    document.body.innerHTML = pageContent;

}
//Another function to print a section of page
const printPageSection = (divID) =>{
    // let printContent = document.getElementById('divID');
    var printWindow = window.open('','','width=900, height=650');
    printWindow.document.write(divID.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
const print = document.querySelector('#print');
print.addEventListener('click', (e) =>{
    e.preventDefault();
    const printable = document.querySelector('#printDiv');
    if(printable.firstElementChild.innerHTML == '') return alert('Nothing to Print!');
    // printDoc(printable);
    printPageSection(printable)
});

//Adding new staff
addStaff.addEventListener('click', (e)=>{
    e.preventDefault();
    
    const name = document.querySelector('#name').value;
    const post = document.querySelector('#post').value;
    const password = document.querySelector('#regPass').value;
    const warning = document.querySelector('.staffWarning');

    if(!name || !post || !password){
        warning.innerHTML ='Wrong Input Format!';
        warning.style.color = 'red';
    }else{
        let data = {
            name,
            password,
            post
        }
        fetch('/addstaff',{
            method:'post',
            headers:{"content-type":"application/json"},
            body:JSON.stringify(data)
        })
        .then(response =>{
            if(response.status === 200){
                warning.innerHTML = 'Registration was Successful!';
                warning.style.color = 'green';
            }else{
                warning.innerHTML = 'Oops! Something went Wrong, please try again.';
                warning.style.color ='red';
            }
        })
        .catch(err =>{
            warning.innerHTML = 'Oops! Something went Wrong, please try again.';
            warning.style.color ='red';
        })  
    }
})
// Add Guest Information
registerGuest.addEventListener('click', (e) =>{
    e.preventDefault();
    const warning = document.querySelector('.guestRegWarning');
    const name = document.querySelector('#gName').value;
    const email = document.querySelector('#gEmail').value;
    const phone = document.querySelector('#gPhone').value;
    const whom = document.querySelector('#gWhom').value;
    const purpose = document.querySelector('#gPurpose').value;
    const arrive = document.querySelector('#gArriveTime').value;
    const departure = document.querySelector('#gDeparture').value;
    const date = document.querySelector('#gDate').value;

    if(!name || !email ||!phone ||!whom ||!purpose ||!arrive ||!departure ||!date){
       warning.innerHTML = 'Please fill out all Fields';
       warning.style.color = 'red';
    }else{
        let data = {
            name,
            email,
            phone,
            whomtosee:whom,
            purpose,
            arrive,
            departure,
            date
        }
        fetch('/addguest',{
            method:'post',
            headers:{"content-type":"application/json"},
            body:JSON.stringify(data)
        })
        .then(Response =>{
            if(Response.status === 200){
                warning.innerHTML = 'Record Added Successfully';
                warning.style.color = 'green';
            }else{
                warning.innerHTML = 'Oops! Something went Wrong. Try again.';
                warning.style.color ='red';
            }
        })
        .catch(err =>console.log(err))
    }
});
