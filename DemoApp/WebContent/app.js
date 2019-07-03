
//realtime provjera broja raspolozivih zahtjeva
db.collection('putovanja').onSnapshot(function(snapshot) {
		
	var brojac = 0; //brojac za zahtjeve koje direktor pregledava
	var brojac2 = 0; //brojac za zahtjeve koje admin radnik pregledava
	var tempmail = email.getValue();
		snapshot.forEach(function(doc){
			if(tempmail === doc.data().email){
				prikaziMojZahtjev();
			}
			if(!doc.data().pregledanZahtjev){
				brojac++;
			}
			if(doc.data().obradjenZahtjev === false){
				brojac2++;
			}
			//updejtovanje prikaza zahtjeva kod korisnika
			
		})
		//ako nema zahtjeva blokiraj button
		if(brojac == 0){
			pregledajZahtjeve.setEnabled(true);
		}
		else if (brojac2 == 0){
			urediZahtjev.setEnabled(true);
		}
		else if(brojac!=0){
			pregledajZahtjeve.setEnabled(false);
		}
		else if(brojac2!=0){
			urediZahtjev.setEnabled(false);
		}	
		
		brojZahtjeva.setText(`Broj preostalih zahtjeva je: ${brojac}`)
		//brojac=0;
		brojZahtjevaUredi.setText(`Broj preostalih zahtjeva je: ${brojac2}`)
		//brojac2=0;
		
})


//box sa login i singup buttonom, popup se pojavi kad se klikne jedan od njih i onda se dalje loguje/signup
var mainbox = new sap.m.FlexBox({
	alignContent: sap.m.FlexAlignContent.Center,
	alignItems: sap.m.FlexAlignItems.Center,
	justifyContent: sap.m.FlexJustifyContent.Center,
	direction: "Column"
}).placeAt('mainPage');



//MAIN PAGE
//signup button
var signup = new sap.m.Button({
	text: "SIGN UP",
	width: "150px",
	type: sap.m.ButtonType.Ghost
})

//SIGNUP POPUP
signup.attachPress(function(){	
	var dialog = new sap.m.Dialog({
		title: 'Unesite korisnicke podatke',
		draggable: true,
		contentWidth: "35%",
		contentHeight: "10%",
		content: [
			new sap.m.Input({
				id: "emailInput",
				placeholder: "email",
				width: "50%"
			}),
			new sap.m.Input("passwordInput", {
				type: sap.m.InputType.Password,
				placeholder: "password",
				width: "50%"
			})
		],
		beginButton: new sap.m.Button({
			text: "Sign up",
			press: function(){
				//kad pritisne se sign up button, kreiraj novog korisnika, ugasi dialog i izbrisi content
				var tempEmail = sap.ui.getCore().byId("emailInput").getValue();
				var tempPW = sap.ui.getCore().byId("passwordInput").getValue();
				auth.createUserWithEmailAndPassword(tempEmail, tempPW).then(function(){
					sap.m.MessageToast.show("Uspjesno kreiranje novog korisnika!")
				}).catch(function(error){
					sap.m.MessageToast.show("Korisnik nije kreiran. Pokusajte ponovo.")
				})
				dialog.destroyContent(); //da obrisemo sav content kako bi mogli kreirati ponovo input1	
				dialog.close();
			}
		}),
		endButton: new sap.m.Button({
			text: "Cancel",
			press:function(){
			dialog.destroyContent(); //da obrisemo sav content kako bi mogli kreirati ponovo input1	
			dialog.close();
		}
		}),
	});
	dialog.open(); // otvaramo dialog

})

//glavni login button
var mainLogin = new sap.m.Button({
	text: "LOGIN",
	width: "150px",
	type: sap.m.ButtonType.Default
})

//kad kliknemo glavni login, izbaci nam page gdje unosimo svoje korisnicke podatke

mainLogin.attachPress(function(){
	mainbox.setVisible(false); //logout je true - vidljiv
	hbox.setVisible(true); //login je false - nevidljiv
});

mainbox.addItem(signup);
mainbox.addItem(mainLogin);


// LOGIN PAGE

//kreiranje flexboxa za LOGIN sa direction column(itemi 1 ispod drugog)
var hbox = new sap.m.FlexBox({
	//fitContainer: true,
	alignContent: sap.m.FlexAlignContent.Center,
	alignItems: sap.m.FlexAlignItems.Center,
	justifyContent: sap.m.FlexJustifyContent.Center,
	direction: "Column",
	width: "100%",
	height: "700px",
	visible: false,
	items: [
		new sap.m.Text({
			text: "Unesite korisnicke podatke:",
				})
		]	
}).placeAt("hbox");


//login input
var email =  new sap.m.Input({
	type: sap.m.InputType.Email, //tip inputa - email
	placeholder: "E-Mail",
	width: "300px",
	textAlign: sap.ui.core.TextAlign.Center
});

//provjera ispravnog maila
//na svaki unos sa tastature
email.onkeyup = function(){
    check = email.getValue(); //preuzmemo vrijednost koja se trenutno ukucava
    mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/; 
    if (!check.match(mailregex)) {
    	//ako je invalid unos
        email.setValueState("Error");
    } else {
    	//ako je validan unos email-a
    	email.setValueState("None");
    }
 }

var password = new sap.m.Input({
	type: sap.m.InputType.Password, //tip inputa - password
	placeholder: "Password",
	width: "300px",
	textAlign: sap.ui.core.TextAlign.Center
});

//login button
var login = new sap.m.Button({
	text: "LOGIN",
	width: "300px",
	type: sap.m.ButtonType.Emphasized
	
});


//na pritisak login
login.attachPress(function(){
	var tempEmail = email.getValue();
	var tempPW = password.getValue();
	console.log(tempEmail);
	console.log(tempPW);
	auth.signInWithEmailAndPassword(tempEmail,tempPW).then(function(){
		fbox.setVisible(true); //logout button vidljiv
		hbox.setVisible(false); //login screen nevidljiv
		sap.m.MessageToast.show("LOGIN uspjesan");
		if(tempEmail === 'direktor@gmail.com'){
			direktorBox.setVisible(true);
			direktorBoxButtons.setVisible(true);
			putovanjaBox.setVisible(false);
			console.log(user.email);
			
		}
		else if(tempEmail === 'adminradnik@gmail.com'){
			putovanjaBox.setVisible(false);
			adminRadnikBox.setVisible(true);
			console.log(user.email);
		}
		else{
			console.log('nije trebalo ovdje');
			putovanjaBox.setVisible(true);
		}
	}).catch(function(error){
		//sap.m.MessageToast.show("Korisnik ne postoji")
	})
})


//funkcionalnost dodana - login koristenjem ENTER na tastaturi
password.onsapenter = (function(){
	var tempEmail = email.getValue();
	var tempPW = password.getValue();
	console.log(tempEmail);
	console.log(tempPW);
	auth.signInWithEmailAndPassword(tempEmail,tempPW).then(function(){
		fbox.setVisible(true); //logout button vidljiv
		hbox.setVisible(false); //login screen nevidljiv
		sap.m.MessageToast.show("LOGIN uspjesan");
		if(tempEmail === 'direktor@gmail.com'){
			direktorBox.setVisible(true);
			direktorBoxButtons.setVisible(true);
			putovanjaBox.setVisible(false);
			console.log(user.email);
			
		}
		else if(tempEmail === 'adminradnik@gmail.com'){
			console.log("welcome adminradnik");
			putovanjaBox.setVisible(false);
			adminRadnikBox.setVisible(true);
		}
		else{
			console.log('nije trebalo ovdje');
			putovanjaBox.setVisible(true);
		}
	}).catch(function(error){
		//sap.m.MessageToast.show("Korisnik ne postoji")
	})
})


//dodavanje inputa/buttona u kreiran hbox
hbox.addItem(email);
hbox.addItem(password);
hbox.addItem(login);


//kreiranje flexboxa sa logout elementom
var fbox = new sap.m.FlexBox({
	alignContent: sap.m.FlexAlignContent.End,
	alignItems: sap.m.FlexAlignItems.End,
	justifyContent: sap.m.FlexJustifyContent.End,
	visible: false, // na login/main screen nije visible, kad se ulogujemo dobijamo pristup ovom boxu + logout buttonu
}).placeAt('header');

//logout button
var logout = new sap.m.Button({
	text: "LOGOUT",
	width: "100px",
	type: sap.m.ButtonType.Ghost,
})

//na pritisak logout
logout.attachPress(function(){
	fbox.setVisible(false); //logout je true - vidljiv
	mainbox.setVisible(true); //login je false - nevidljiv
	auth.signOut().then(function(){
		putovanjaBox.setVisible(false);
		inputPutovanja.setVisible(false);
		sap.m.MessageToast.show("Korisnik odjavljen");
		direktorBox.setVisible(false);
		adminRadnikBox.setVisible(false);
		provjeriPutovanja.setVisible(false);

	});
})
fbox.addItem(logout);




//NAKON LOGIN - KREIRAJ / PROVJERI ZAHTJEV PAGE

var putovanjaBox = new sap.m.FlexBox({
	alignContent: sap.m.FlexAlignContent.Center,
	alignItems: sap.m.FlexAlignItems.Center,
	justifyContent: sap.m.FlexJustifyContent.Center,
	visible: false
}).placeAt('mainPage');

var kreirajZahtjev = new sap.m.Button({
	width: "200px",
	text: "Kreiraj zahtjev"
});

var provjeriZahtjev = new sap.m.Button({
	width: "200px",
	text: "Provjeri zahtjev"
});



putovanjaBox.addItem(kreirajZahtjev);
putovanjaBox.addItem(provjeriZahtjev);



// KREIRAJ ZAHTJEV

var inputPutovanja = new sap.m.FlexBox({
	alignContent: sap.m.FlexAlignContent.Center,
	alignItems: sap.m.FlexAlignItems.Center,
	justifyContent: sap.m.FlexJustifyContent.Center,
	direction: 'Column',
	visible: false
}).placeAt('radnik'); 

kreirajZahtjev.attachPress(function(){
	putovanjaBox.setVisible(false);
	inputPutovanja.setVisible(true);
	//var korisnik = auth.getInstance().getCurrentUser();
	//console.log(korisnik);
});




// Provjeri kreiran zahtjev


function prikaziMojZahtjev(){
	provjeriPutovanja.destroyItems(); // da ponisitimo sve prethodno kako se ne bi pri svakom pozivu kreirano novi customlistitem
	var tempmail = email.getValue();
	db.collection('putovanja').get().then(function(snapshot) {
	snapshot.forEach(function(doc){
		if(tempmail === doc.data().email){
	var customlist = new sap.m.CustomListItem({
	})
	console.log('usao u if');
	console.log(doc.data().email);
	var hotel = new sap.m.DisplayListItem({
		label: "Ime i adresa hotela",
		value: doc.data().hotel
	});
	
	var prevoz = new sap.m.DisplayListItem({
		label: "Prevoz",
		value: doc.data().prevoz
	});
	
	var dokumentacija = new sap.m.DisplayListItem({
		label: "Dokumentacija",
		value: doc.data().dokumentacija
	});
	
	var osiguranje = new sap.m.DisplayListItem({
		label: "Osiguranje",
		value: doc.data().osiguranje
	});
	
	var uplate = new sap.m.DisplayListItem({
		label: "Uplate",
		value: doc.data().uplate
	});
	
	var PutovanjaText = new sap.m.Text({
		text: "Vasi trenutni zahtjevi: ",
		textAlign: sap.ui.core.TextAlign.Center
	})
	
	
	customlist.addContent(hotel);
	customlist.addContent(prevoz);
	customlist.addContent(dokumentacija);
	customlist.addContent(osiguranje);
	customlist.addContent(uplate);
	provjeriPutovanja.addItem(PutovanjaText);
	provjeriPutovanja.addItem(customlist);
		} // kraj if
	});
	}); // kraj get snapshot
}


var provjeriPutovanja = new sap.m.FlexBox({
	alignContent: sap.m.FlexAlignContent.Center,
	alignItems: sap.m.FlexAlignItems.Center,
	justifyContent: sap.m.FlexJustifyContent.Center,
	direction: 'Column',
	visible: false
}).placeAt('zahtjev'); 






provjeriZahtjev.attachPress(function(){
	putovanjaBox.setVisible(false);
	provjeriPutovanja.setVisible(true);
	prikaziMojZahtjev();
});


//kreiranje input varijabli
var ime =  new sap.m.Input({
	placeholder: "Ime",
	width: "400px",
	textAlign: sap.ui.core.TextAlign.Center
});

var prezime = new sap.m.Input({
	placeholder: "Prezime",
	width: "400px",
	textAlign: sap.ui.core.TextAlign.Center
});

var odrediste = new sap.m.Input({
	placeholder: "Odrediste",
	width: "400px",
	textAlign: sap.ui.core.TextAlign.Center
});

var vrPolazak = new sap.m.DatePicker({
	placeholder: "Vrijeme polaska",
	width: "400px",
	textAlign: sap.ui.core.TextAlign.Center
});

var vrDolazak = new sap.m.DatePicker({
	placeholder: "Vrijeme dolaska",
	width: "400px",
	textAlign: sap.ui.core.TextAlign.Center
});


var posaljiZahtjev = new sap.m.Button({
	text: "Posalji zahtjev",
	width: "200px"
});



posaljiZahtjev.attachPress(function(){	
	var tempIme = ime.getValue();
	var tempPrezime = prezime.getValue();
	var tempOdrediste = odrediste.getValue();
	var tempvrDolazak = vrDolazak.getValue();
	var tempvrPolazak = vrPolazak.getValue();
		
	var user = firebase.auth().currentUser;
	
	console.log(tempIme);
	console.log(tempPrezime);
	console.log(tempOdrediste);
	console.log(tempvrPolazak);
	console.log(tempvrDolazak);
	
//dodaj novi dokument u kolekciju putovanja
	db.collection("putovanja").doc(user.email).set({
	    ime: tempIme,
	    prezime: tempPrezime,
	    email: user.email,
	    odrediste: tempOdrediste,
	    vrijemePolaska: tempvrPolazak,
	    vrijemeDolaska: tempvrDolazak,
	    obradjenZahtjev: false,
	    pregledanZahtjev: false,
	    hotel: " ",
	    uplate: false,
	    prevoz: " ",
	    osiguranje: " ",
	    dokumentacija: false,
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
	inputPutovanja.setVisible(false); // vracamo se na pocetnu stranicu // input nije vidljiv
	putovanjaBox.setVisible(true);
	kreirajZahtjev.setBlocked(true); //blokiraj kreirajZahtjev button jer je vec kreiran zahtjev
});

inputPutovanja.addItem(ime);
inputPutovanja.addItem(prezime);
inputPutovanja.addItem(odrediste);
inputPutovanja.addItem(vrPolazak);
inputPutovanja.addItem(vrDolazak);
inputPutovanja.addItem(posaljiZahtjev);


//PRIKAZI ZAHTJEVE POJEDINACNO
function prikaziZahtjev(){
	var BreakException = {};
	//ne mozemo break u for each pa throwamo exception nakon svakog pojedinacnog prikaza
	try {
		db.collection('putovanja').get().then(function(snapshot) {
			snapshot.forEach(function(doc){
				var check = false;
				if(!doc.data().pregledanZahtjev){
						check = true;
						var tempmail = doc.data().email
						var customlist = new sap.m.CustomListItem({
						})
						var list = new sap.m.NotificationListItem({
							title: `Zahtjev na cekanju:`,
							showCloseButton: true,
							authorName: doc.data().ime,
							unread: true,
							authorPicture: "https://image.flaticon.com/icons/svg/201/201623.svg",
							description: `Zahtjev kreiran od strane: ${doc.data().ime} ${doc.data().prezime} \n
							Odrediste: ${doc.data().odrediste} \n
							Vrijeme polaska: ${doc.data().vrijemePolaska} \n
							Vrijeme dolaska: ${doc.data().vrijemeDolaska}`,
							buttons: [
								new sap.m.Button({
									text:"accept",
									type: sap.m.ButtonType.Accept,
									press: function(){
										pregledajZahtjeve.setEnabled(true);
										db.collection('putovanja').doc(tempmail).update({
										pregledanZahtjev: true
										});
										customlist.setVisible(false);
										
									}
								}),
								new sap.m.Button({
									text:"reject",
									type: sap.m.ButtonType.Reject,
									press: function(){
										pregledajZahtjeve.setEnabled(true);
										db.collection('putovanja').doc(tempmail).update({
										pregledanZahtjev: true
										});
										customlist.setVisible(false);	
									}
								})
							]
						});
						customlist.addContent(list);
						direktorBox.addItem(customlist)
					}//kraj if	
				 if (check) throw BreakException; // break statement, samo 1 zahtjev visible
			})
		})    
		} 
	catch (e) {
		  if (e !== BreakException) throw e;
		}
}

//DIRECTOR PAGE
var direktorBox =  new sap.m.FlexBox({
	//alignContent: sap.m.FlexAlignContent.Center,
	//alignItems: sap.m.FlexAlignItems.Center,
	//justifyContent: sap.m.FlexJustifyContent.Center,
	visible: false,
	direction: 'Column',
	width: "100%",
}).placeAt('content');

var brojZahtjeva = new sap.m.Text({
})

var pregledajZahtjeve = new sap.m.Button({
	text: "Pregledaj zahtjev"
})


pregledajZahtjeve.attachPress(function(){
	pregledajZahtjeve.setEnabled(false);
	prikaziZahtjev();
})

direktorBox.addItem(pregledajZahtjeve);
direktorBox.addItem(brojZahtjeva);




// ADMIN-RADNIK PAGE

function zahtjev(){
	var BreakException = {};
	//ne mozemo break u for each pa throwamo exception nakon svakog pojedinacnog prikaza
	try {
		db.collection('putovanja').get().then(function(snapshot) {
			snapshot.forEach(function(doc){
				var check = false;
				if(doc.data().pregledanZahtjev && !doc.data().obradjenZahtjev){
						var tempmail = doc.data().email
						check = true;
						
						var customlist = new sap.m.CustomListItem({
						});
						
						var opisPutnika = new sap.m.Text({
							text: ` Putnik: ${doc.data().ime} ${doc.data().prezime}
									Vrijeme polaska: ${doc.data().vrijemePolaska} \n Odrediste: ${doc.data().odrediste}`
						})
						
				
						var hotel = new sap.m.InputListItem({
							label: "Unesite ime i adresu hotela",	
							content: [
								
								new sap.m.Input({
									id: "hotelAdresa",
									placeholder: "Ime i Adresa Hotela",
									width: "25%"
								}),
								new sap.m.Button({
									text: "Potvrdi ime i adresu",
									press: function() {
										this.setType(sap.m.ButtonType.Accept);
										var item = sap.ui.getCore().byId("hotelAdresa").getValue();
										console.log(item);
										db.collection('putovanja').doc(tempmail).update({
											hotel: item
										});
										sap.m.MessageToast.show("Adresa hotela potvrdjena!");
										
									}
								})
							]
						});

						
						var dokumentacija = new sap.m.InputListItem({
							label: "Pripremi dokumentaciju",	
							content: [
								new sap.m.Button({
									text: "Da",
									press: function(){
										this.setType(sap.m.ButtonType.Accept);
										db.collection('putovanja').doc(tempmail).update({
											dokumentacija: true
										});
										sap.m.MessageToast.show("Dokumentacija pripremljena!");
									}
										
								}),
								new sap.m.Button({
									text: "Ne",
									press: function(){
										this.setType(sap.m.ButtonType.Reject);
										db.collection('putovanja').doc(tempmail).update({
											dokumentacija: false
										});
									}
								})
							]
						});
						
						var uplate = new sap.m.InputListItem({
							label: "Pripremi uplate za hotel i prevoz",	
							content: [
								new sap.m.Button({
									text: "Da",
									press: function(){
										this.setType(sap.m.ButtonType.Accept);
										db.collection('putovanja').doc(tempmail).update({
											uplate: true
										});
										sap.m.MessageToast.show("Hotel i prevoz uplacen!");
									}
										
								}),
								new sap.m.Button({
									text: "Ne",
									press: function(){
										this.setType(sap.m.ButtonType.Reject);
										db.collection('putovanja').doc(tempmail).update({
											uplate: false
										});
									}
								})
							]
						});
						
						
						var osiguranje = new sap.m.InputListItem({
							label: "Kupi putno osiguranje",	
							content: [
								new sap.m.Button({
									text: "Da",
									press: function(){
										this.setType(sap.m.ButtonType.Accept);
										db.collection('putovanja').doc(tempmail).update({
											osiguranje: true
										});
										sap.m.MessageToast.show("Putno osiguranje kupljeno!");
									}
										
								}),
								new sap.m.Button({
									text: "Ne",
									press: function(){
										this.setType(sap.m.ButtonType.Reject);
										db.collection('putovanja').doc(tempmail).update({
											osiguranje: false
										});
									}
								})
							]
						});
						
						var prevoz = new sap.m.InputListItem({
							label: "Odabir prevoza",	
							content: [
								new sap.m.Select("odaberiPrevoz", {
									items: [
										 new sap.ui.core.ListItem({
											text: 'Auto'
										}),
										 new sap.ui.core.ListItem({
												text: 'Autobus'
										}),
										new sap.ui.core.ListItem({
											text: 'Avion'
									}),
									new sap.ui.core.ListItem({
										text: 'Voz'
								}),
								] //kraj select-a
							}),
							
							new sap.m.Button({
								text: "Potvrdi prevoz",
								press: function(){
									this.setType(sap.m.ButtonType.Accept);
									var item = sap.ui.getCore().byId("odaberiPrevoz").getSelectedItem().mProperties.text;
										db.collection('putovanja').doc(tempmail).update({
											prevoz: item
										});
										sap.m.MessageToast.show(`Odabran prevoz: ${item}`);
									
								}
							})
							]
						});
						var zavrsiObradu = new sap.m.Button({
							text: "Zavrsi obradu zahtjeva",
							press: function(){
								db.collection('putovanja').doc(tempmail).update({
									obradjenZahtjev: true
									});
								prevoz.destroyContent(); //zbog id da ne bi bio duplicate
								hotel.destroyContent();
								urediZahtjev.setEnabled(true);
								customlist.setVisible(false);
							}
							
						})
						customlist.addContent(opisPutnika);
						customlist.addContent(hotel);
						customlist.addContent(dokumentacija);
						customlist.addContent(osiguranje);
						customlist.addContent(prevoz);
						customlist.addContent(uplate);
						customlist.addContent(zavrsiObradu);
						adminRadnikBox.addItem(customlist)
					}//kraj if	
				
				 if (check) throw BreakException; // break statement, samo 1 zahtjev visible
			})
		})    
		} 
	catch (e) {
		  if (e !== BreakException) throw e;
		}
}


var adminRadnikBox =  new sap.m.FlexBox({
	visible: false,
	direction: 'Column',
	width: "100%",
}).placeAt('adminRadnik');



var brojZahtjevaUredi = new sap.m.Text({
})

var urediZahtjev = new sap.m.Button({
	enabled: true,
	blocked: false,
	text: "Uredi zahtjev"
})


urediZahtjev.attachPress(function(){
	urediZahtjev.setEnabled(false);
	zahtjev();
})


adminRadnikBox.addItem(urediZahtjev);
adminRadnikBox.addItem(brojZahtjevaUredi);


//prikaziZahtjev za korisnika (pregledavanje zahtjeva)





