
import! 'display.worlds.aeiou.Vowel';
import! 'display.worlds.aeiou.Audio';

namespace `display.worlds.aeiou` (
    @tag("level-challenge");
    class Challenge extends WebComponent {
        constructor(world, level, machine) {
            super()
            // this.machine = machine;
            // this.world   = world;
            this.level   = level;
            this.sounds = {
                "a" : new Audio("/resources/sounds/a.mp3"),
                "e" : new Audio("/resources/sounds/e.mp3"),
                "i" : new Audio("/resources/sounds/i.mp3"),
                "o" : new Audio("/resources/sounds/o.mp3"),
                "u" : new Audio("/resources/sounds/u.mp3")
            }
            this.onReset();
        }

        onLoadInstanceStylesheet(){return false}

        async onConnected() {
            await super.onConnected();
            this.addEventListener("click", e=> this.onVowelClicked(e), true, "vowel-sound");
            this.showVowels();
            this.onPause();
            this.makePattern();
            await this.sayPattern();
            this.onResume();
        }

        showVowels(){
            for(var vowel in this.sounds){
                var sound = this.sounds[vowel];
                    sound.loop=false;
                    sound.load();
                var vowel = new display.worlds.aeiou.Vowel({audio:sound,vowel});
                this.append(vowel);
            }            
        }

        makePattern(){
            //TODO: Randomize NPC pattern
            this.npc_pattern.push("a");
            this.npc_pattern.push("i");
        }


        async sayPattern(){
            for(var i=0; i<=this.npc_pattern.length-1; i++){
                var vowel = this.npc_pattern[i];
                var sound = this.sounds[vowel];
                    sound.loop=false;
                    sound.load();
                await sound.playsync();
            } 
            this.finished_speaking=true;
        }


        onVowelClicked(e){
            if(this.paused){
                e.stopPropagation();
                e.preventDefault=true
                return
            }
            this.user_pattern.push(
                e.target.getAttribute("data-vowel")
            );
            this.check();
        }

        check(){
            var npc_vowel = this.npc_pattern[this.tries];
            var usr_vowel = this.user_pattern[this.tries];
            console.log("npc_vowel", npc_vowel);
            console.log("usr_vowel",usr_vowel);
            if(npc_vowel==usr_vowel){
                this.dispatchEvent("score", {amount:this.vowel_points});
            }
            else {
                this.dispatchEvent("damage", {amount:50});
            }
            this.tries++;
            this.isFinished = this.tries >= this.npc_pattern.length;
        }

        template(){
            return `<template></template>`
        }

        //----------------FOR MACHINE-------------------
        async onStart() {
            this.isStarted=true;  
            this.level.append(this) 
            console.log(this.namespace + " Started")
        }

        onEnd(){
            console.warn(this.namespace + " Ended");
            this.dispatchEvent("challengedone")
            this.remove();
            this.onReset();
        }

        onReset(){
            this.isFinished = false;
            this.isStarted  = false;
            this.isBlocking = false;
            this.npc_pattern = [];
            this.user_pattern = []; 
            this.vowel_points = 10;
            this.correct_answers = 0;
            this.tries        = 0;
        }

        onPause(){this.paused=true}

        onResume(){if(this.finished_speaking){this.paused=false}}

        onUpdate(){}
    }
);
