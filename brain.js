var delayedAction;

// automatically notify of internet connection
window.addEventListener('offline', function(e) { say("You've lost your internet connection."); });
window.addEventListener('online', function(e) { say("We're back online now."); });

function converse() {
  clearTimeout(delayedAction); // reset if still typing
  delayedAction = setTimeout(function(){
    var heard = listen();
    if (heard) {
      speak(heard);
      clearMessageHeardAlready();
    }
  }, 2000);
}

function listen() {
  var heard = document.getElementById("input").value;
  return heard;
}

function clearMessageHeardAlready() {
  document.getElementById("input").value = '';
}

function say(sentence) {
  responsiveVoice.speak(sentence, 'UK English Male');
}

function didHear(heard, listOfChecks=[], checkType='exactly') {
  for (var i in listOfChecks) {
    if (checkType === 'exactly' && heard === listOfChecks[i]) { return true; }
    else if (checkType === 'starts with' && heard.startsWith(listOfChecks[i])) { return true; }
    else if (checkType === 'ends with' && heard.endsWith(listOfChecks[i])) { return true; }
  }
  return false;
}

function speak(heard) {
  // TODO: add more functionality
  // TODO: make more modular

  // remove trailing/leading spaces, set to lowercase, and remove punctuation
  heard = heard.trim().toLowerCase();
  heard = heard.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/i,"");

  var heardRecognized = false;

  heardRecognized |= heardPleasantries(heard);

  heardRecognized |= heardSearch(heard);

  if (!heardRecognized) {
    var sentence = "You said: " + heard + '...' + "Sorry, I currently don't have a pre-programmed response to that.";
    // need '...' to make an audible pause
    say(sentence);
  }
}

function heardPleasantries(heard) {
  if (didHear(heard,['hi','hey','hello'])) {
    say(heard);
    return true;
  } else if (didHear(heard,['hello world','anyone home','anyone there','anyone listening'])) {
    say('hi there');
    return true;
  } else if (didHear(heard,["hi there",'hey there'])) {
    say('right back at you');
    return true;
  } else if (didHear(heard,["is this thing on",'can you hear me',"does this thing work",'are you on right now'])) {
    say('yes');
    return true;
  } else if (didHear(heard,['thanks','thank you'])) {
    say("you're welcome");
    return true;
  } else if (didHear(heard,['thank you so much','thank you very much'])) {
    say("you're very welcome");
    return true;
  } else if (didHear(heard,['goodbye','bye','byebye','see you','see you later'])) {
    say('farewell'); //  + '...Would you like me to shut down?'
    return true;
  }
  // otherwise
  return false;
}

function heardSearch(heard) {
  const signalPhrases = ['what is the ', 'what are the ', 'what was the ', 'what were the ',
                        'what is a ', 'what is ', 'what are ', 'what was ', 'what were ',
                        'search for ']
  if (didHear(heard, signalPhrases, 'starts with')) {
    var words = removeSignalPhrase(heard,signalPhrases);
    search(words);
    say('you searched for: ' + words);
    return true;
  }
  // otherwise
  return false;
}

function removeSignalPhrase(heard, signalPhrases) {
  var words = heard;
  for (var i in signalPhrases) {
    words = words.replace(signalPhrases[i],'');
  }
  return words;
}

function search(words) {
  //
}
