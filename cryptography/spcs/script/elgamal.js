/* Number variables */
var BobPublicPrime = 541;
var BobPublicPrimitiveRoot = 10;
var AliceSecretMessage;
var AliceRandomKey;
var AliceCipherTextOne;
var AliceCipherTextTwo;
var BobSecretKey;
var BobPublicKey;
var BobReceivedMessage;
var junk;

/* Number Functions */
/* Code based on http://dkerr.home.mindspring.com/diffie_hellman_calc.html */
function BobPickKey(){
	BobPublicPrime = document.getElementById("public_prime").value;
	BobPublicPrimitiveRoot = document.getElementById("public_primitive_root").value;
	BobSecretKey = document.getElementById("bob_secret_key").value;
	BobPublicKey = discrete_exp(BobPublicPrimitiveRoot, BobSecretKey, BobPublicPrime);
	//Bob publishes public key
	var bob_sent_msg = document.createElement("div");
	bob_sent_msg.id = "bob_message";
	bob_sent_msg.className = "message_class";
	bob_sent_msg.style.justifyContent = "center";
	bob_sent_msg.style.alignContent = "center";
	bob_sent_msg.style.textAlign = "center";
	bob_sent_msg.innerHTML = "Bob announces <br>"
	document.getElementById("messages").appendChild(bob_sent_msg);

	var bob_sent_msg1 = document.createElement("div");
	bob_sent_msg1.id = "bob_public_prime";
	bob_sent_msg1.style.display = "inline-flex";
	bob_sent_msg1.style.margin = "5px";
	bob_sent_msg1.innerHTML = "<div id='bob_message_text1' width='350px' style='display:inline-flex'></div>"
	                        + "<div class='keybox'>p: <br>" + BobPublicPrime + "</div>";
	document.getElementById("bob_message").appendChild(bob_sent_msg1);
    $("#bob_message_text1").animate({
        width: "0px"
    }, 1000, function(){
				var bob_sent_msg2 = document.createElement("div");
				bob_sent_msg2.id = "bob_public_primitive_root";
				bob_sent_msg2.style.display = "inline-flex";
				bob_sent_msg2.style.margin = "5px";
				bob_sent_msg2.innerHTML = "<div id='bob_message_text2' width='300px' style='display:inline-flex'></div>"
										+ "<div class='keybox'>g: <br>" + BobPublicPrimitiveRoot + "</div>";
				document.getElementById("bob_message").appendChild(bob_sent_msg2);
				$("#bob_message_text2").animate({
					width: "0px"
				}, 1000, function(){
							var bob_sent_msg3 = document.createElement("div");
							bob_sent_msg3.id = "bob_public_key";
							bob_sent_msg3.style.display = "inline-flex";
							bob_sent_msg3.style.margin = "5px";
							bob_sent_msg3.innerHTML = "<div id='bob_message_text3' width='250px' style='display:inline-flex'></div>"
													+ "<div class='keybox'>A: <br>" + BobPublicKey + "</div>";
							document.getElementById("bob_message").appendChild(bob_sent_msg3);
							$("#bob_message_text3").animate({
								width: "0px"
							}, 1000);
					});
		});
}

function AliceChangeMessage(){
	AliceSecretMessage = document.getElementById("alice_secret_message").value;
	AliceRandomKey = document.getElementById("alice_random_key").value;
}

function AliceFindCipherTextOne(){
	AliceCipherTextOne = discrete_exp(BobPublicPrimitiveRoot, AliceRandomKey, BobPublicPrime);
	document.getElementById("alice_ciphertext_one").innerHTML = AliceCipherTextOne;
}

function AliceFindCipherTextTwo(){
	junk = discrete_exp(BobPublicKey, AliceRandomKey, BobPublicPrime);
	AliceCipherTextTwo = (junk*AliceSecretMessage)%BobPublicPrime;
	document.getElementById("alice_ciphertext_two").innerHTML = AliceCipherTextTwo;
}

function AliceSendMessage(){
	//Alice Sends Message to Bob
	var alice_sent_msg = document.createElement("div");
	alice_sent_msg.id = "alice_message";
	alice_sent_msg.className = "message_class";
	alice_sent_msg.style.justifyContent = "center";
	alice_sent_msg.style.alignContent = "center";
	alice_sent_msg.style.textAlign = "center";
	alice_sent_msg.style.flexDirection = "row-reverse";
	alice_sent_msg.innerHTML = "Alice sends Bob <br>"
	document.getElementById("messages").appendChild(alice_sent_msg);
	
	var alice_sent_msg1 = document.createElement("div");
	alice_sent_msg1.id = "alice_public_ciphertext_one";
	alice_sent_msg1.style.display = "inline-flex";
	alice_sent_msg1.style.margin = "5px";
	alice_sent_msg1.innerHTML = "<div id='alice_message_text1' width='300px' style='display:inline-flex'></div>"
	                       + "<div class='keybox'>c1: <br>" + AliceCipherTextOne + "</div>";
	document.getElementById("alice_message").appendChild(alice_sent_msg1);
    $("#alice_message_text1").animate({
        width: "0px"
    }, 1000, function(){
				var alice_sent_msg2 = document.createElement("div");
				alice_sent_msg2.id = "alice_public_ciphertext_two";
				alice_sent_msg2.style.display = "inline-flex";
				alice_sent_msg2.style.margin = "5px";
				alice_sent_msg2.innerHTML = "<div id='alice_message_text2' width='250px' style='display:inline-flex'></div>"
										+ "<div class='keybox'>c2: <br>" + AliceCipherTextTwo + "</div>";
				document.getElementById("alice_message").appendChild(alice_sent_msg2);
				$("#alice_message_text2").animate({
					width: "0px"
				}, 1000);
		});
	//Bob Calculates Shared Secret Key
	junk = discrete_exp(AliceCipherTextOne, BobSecretKey, BobPublicPrime);
	BobReceivedMessage = (AliceCipherTextTwo*xgcd(junk, BobPublicPrime)[0])%BobPublicPrime;
	document.getElementById("bob_received_message").innerHTML = BobReceivedMessage;
}

function discrete_exp(t,u,n) {   // args are base, exponent, modulus
// computes s = (t ^ u) mod n
// (see Bruce Schneier's book, _Applied Cryptography_ p. 244)
   var s = 1;
   while (u) { if (u&1) {s = (s*t) % n}; u >>= 1; t = (t*t)%n; };
   return s;
}

/*Source: http://pages.pacificcoast.net/~cazelais/euclid.html */
function xgcd(a,b)
{ 
 if (b == 0){
		return [1, 0, a];
    }
 else{
		temp = xgcd(b, a % b);
		x = temp[0];
		y = temp[1];
		d = temp[2];
		return [y, x-y*Math.floor(a/b), d];
	}
}