/* Color variables */
var OurSharedColor;
var AliceSecretColor;
var AliceMixedColor;
var BobSecretColor = "#ffcccc";
var BobMixedColor;
var BobSharedSecretColor;
var AliceSharedSecretColor;
var Color1;
var Color2;
/* Number variables */
var PublicPrime = 541;
var PublicPrimitiveRoot = 10;
var AliceSecretKey;
var AlicePublicKey;
var BobSecretKey = 203;
var BobPublicKey;
var BobSharedSecretKey;
var AliceSharedSecretKey;

/* Color Functions */
function AliceChangeSecretColor(){
// Change color when Alice chooses her secret color
  var hex = document.getElementById("alice_secret_text").value; 
  AliceSecretColor = "#" + hex;
  document.getElementById("alice_secret_color").style.backgroundColor = AliceSecretColor;
}

function AliceChangeMixedColor(){
// Compute Alice's mixed color
  Color1 = new ColorMix.Color().fromHex(OurSharedColor);
  Color2 = new ColorMix.Color().fromHex(AliceSecretColor);
  AliceMixedColor = ColorMix.mix([Color1,Color2]);
  document.getElementById("alice_mixed").style.backgroundColor = AliceMixedColor.toString('hex');
}

function AliceSendColor(){
// Alice sends Color to Bob
	var alice_msg = document.createElement("div");
	alice_msg.id = "alice_message";
	alice_msg.className = "message_class";
	alice_msg.innerHTML = "<div id='alice_message_text' style='display:inline-block'></div><div class='colorbox' style='display:inline-block; background-color:" + AliceMixedColor.toString('hex') + "'></div>";
	document.getElementById("messages").appendChild(alice_msg);
    $("#alice_message_text").animate({
        width: "250px"
    }, 3000, function(){
		document.getElementById("alice_message_text").innerHTML = "Alice sends Bob the message: ";
		$("#alice_message_text").hide().fadeIn("slow", function() {
		// Animation complete
		});
	}
	);
// Bob computes shared secret color
  Color1 = new ColorMix.Color().fromHex(BobSecretColor);
  Color2 = new ColorMix.Color().fromHex(AliceMixedColor);  
  BobSharedSecretColor = ColorMix.mix([Color1, Color2, Color2]);
  document.getElementById("bob_shared_secret").style.backgroundColor = BobSharedSecretColor.toString('hex');
}

function AliceChangeSharedSecretColor(){
// Compute Alice's shared secret color
//   AliceSharedSecretColor = BobSharedSecretColor;
  Color1 = new ColorMix.Color().fromHex(AliceSecretColor);
  Color2 = new ColorMix.Color().fromHex(BobMixedColor); 
  AliceSharedSecretColor = ColorMix.mix([Color1, Color2, Color2]);
  document.getElementById("alice_shared_secret").style.backgroundColor = AliceSharedSecretColor.toString('hex');
}

function ChangeSharedColor(){
// Change shared color
  var hex = document.getElementById("shared_text").value;
  OurSharedColor = "#" + hex;
  document.getElementById("shared_color").style.backgroundColor = OurSharedColor;
  
  //Update Bob's mixed color
  Color1 = new ColorMix.Color().fromHex(BobSecretColor);
  Color2 = new ColorMix.Color().fromHex(OurSharedColor);
  BobMixedColor = ColorMix.mix([Color1,Color2]);
  document.getElementById("bob_mixed").style.backgroundColor = BobMixedColor.toString('hex');

  //Bob Sends Color to Alice
	var bob_msg = document.createElement("div");
	bob_msg.id = "bob_message";
	bob_msg.className = "message_class";
	bob_msg.innerHTML = "<div id='bob_message_text' style='display:inline-block; width:350px'></div><div class='colorbox' style='display:inline-block; background-color:" + BobMixedColor.toString('hex') + "'></div>";
	document.getElementById("messages").appendChild(bob_msg);
    $("#bob_message_text").animate({
        width: "250px"
    }, 3000, function(){
		document.getElementById("bob_message_text").innerHTML = "Bob sends Alice the message: ";
		$("#bob_message_text").hide().fadeIn("slow", function() {
		// Animation complete
		});
	}
	);
}

/* Number Functions */
/* Code based on http://dkerr.home.mindspring.com/diffie_hellman_calc.html */
function AliceChangeSecretKey(){
	AliceSecretKey = document.getElementById("alice_secret_text").value; 
}

function AliceChangePublicKey(){
	AlicePublicKey = discrete_exp(PublicPrimitiveRoot, AliceSecretKey, PublicPrime);
	document.getElementById("alice_public").innerHTML = AlicePublicKey;
}

function AliceSendKey(){
	//Alice Sends Key to Bob
	var alice_msg = document.createElement("div");
	alice_msg.id = "alice_message";
	alice_msg.className = "message_class";
	alice_msg.innerHTML = "<div id='alice_message_text' style='display:inline-flex'></div><div class='keybox' style='margin-top: 5px; margin-bottom: 5px'>" + AlicePublicKey.toString() + "</div>";
	document.getElementById("messages").appendChild(alice_msg);
    $("#alice_message_text").animate({
        width: "250px"
    }, 3000, function(){
		document.getElementById("alice_message_text").innerHTML = "Alice sends Bob the message: ";
		$("#alice_message_text").hide().fadeIn("slow", function() {
		// Animation complete
		});
	}
	);
	//Bob Calculates Shared Secret Key
	BobSharedSecretKey = discrete_exp(AlicePublicKey, BobSecretKey, PublicPrime);
	document.getElementById("bob_shared_secret").innerHTML = BobSharedSecretKey;
}

function AliceChangeSharedSecretKey(){
	AliceSharedSecretKey = discrete_exp(BobPublicKey, AliceSecretKey, PublicPrime);
	document.getElementById("alice_shared_secret").innerHTML = AliceSharedSecretKey;
}

function ChangeSharedKey(){
	PublicPrime = document.getElementById("public_prime").value;
	PublicPrimitiveRoot = document.getElementById("public_primitive_root").value;
	//Bob calculates public key
	BobPublicKey = discrete_exp(PublicPrimitiveRoot, BobSecretKey, PublicPrime);
	document.getElementById("bob_public").innerHTML = BobPublicKey;
	//Bob sends public key to Alice
	var bob_msg = document.createElement("div");
	bob_msg.id = "bob_message";
	bob_msg.className = "message_class";
	bob_msg.innerHTML = "<div id='bob_message_text' style='display:inline-flex; width:315px'></div><div class='keybox' style='margin-top: 5px; margin-bottom: 5px'>" + BobPublicKey.toString() + "</div>";
	document.getElementById("messages").appendChild(bob_msg);
    $("#bob_message_text").animate({
        width: "250px"
    }, 3000, function(){
		document.getElementById("bob_message_text").innerHTML = "Bob sends Alice the message: ";
		$("#bob_message_text").hide().fadeIn("slow", function() {
		// Animation complete
		});
	}
	);
}

function discrete_exp(t,u,n) {   // args are base, exponent, modulus
// computes s = (t ^ u) mod n
// (see Bruce Schneier's book, _Applied Cryptography_ p. 244)
   var s = 1;
   while (u) { if (u&1) {s = (s*t) % n}; u >>= 1; t = (t*t)%n; };
   return s;
}

