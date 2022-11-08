import './style.scss';
//the farm :)
let farmElement: Element | null = document.getElementById('farm');

//helper functions
function premissionPrint(model: string) {
    switch (model) {
        case'loop':
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true)
                }, 20)
            })
        case'once':
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true)
                }, 5000)
            })
        default:
            return new Promise(resolve => {
                setInterval(() => {
                    resolve(true)
                }, 20)
            })
    }
}

//interfaces
interface changePositionArgument {
    bool: boolean
    fieldName: string
}

//base //parent class
abstract class Animal {
    _type: string;
    _soundText: string;
    _sounding: boolean = false;
    _fooding: boolean = false;
    _id: number;
    _src: string;
    _food: string;

    constructor(type: string, id: number, src: string, food: string) {
        this._type = type;
        this._src = src;
        this._soundText = 'not sound';
        this._id = id;
        this._food = food
    };

    set changePosition(arg: changePositionArgument) {
        arg.fieldName === '_sounding' ? this._sounding = arg.bool : null;
        arg.fieldName === '_fooding' ? this._fooding = arg.bool : null;
    };

    silent(animalTarget: Animal) {
        let currentSoundElement = document.querySelector(`.sound-tx-${animalTarget._id}`)
        currentSoundElement != null && currentSoundElement.remove();
        //log
        console.log(`${this._type}:${this._id} is silent`);
    };

    displaySound(): void {
        if (this._sounding) {
            let targetElement = document.getElementById(`${this._id}`)
            let soundElement = document.createElement('div')
            soundElement.setAttribute('class', `sound-tx-${this._id}`)
            soundElement.classList.add('sound-tx')
            soundElement.innerText = this._soundText;
            if (targetElement !== null) {
                targetElement.appendChild(soundElement)
            }
        }
    };

    displayFood(): void {
        if (this._fooding) {
            let targetElement = document.getElementById(`${this._id}`)
            let soundElement = document.createElement('div')
            soundElement.setAttribute('class', `food-tx-${this._id}`)
            soundElement.classList.add('food-tx')
            soundElement.innerHTML = `<img src="${this._food}" />`
            if (targetElement !== null) {
                targetElement.appendChild(soundElement)
            }
        }
    };
}

//extended classes
class Sheep extends Animal {
    static _sheepCount = 0;

    constructor(id: number) {
        super('sheep', id, 'assets/sheep.png', 'assets/barg.jpg');
        this._soundText = "Baaaaa...";
        Sheep._sheepCount++;
    }
};

class Cow extends Animal {
    constructor(id: number) {
        super('cow', id, 'assets/cow.png', 'assets/barg.jpg');
        this._soundText = "Maaaaa...";
    };
};

class Dog extends Animal {
    constructor(id: number) {
        super('dog', id, 'assets/dog.png', 'assets/dogFood.jpeg');
        this._soundText = "Hopppp...";
    };
};

//genearating animals
class AnimalGenertor {
    _totalAnimals: Animal[];

    constructor() {
        this._totalAnimals = []
    };

    generateAnimal() {
        for (let i: number = 0; i < 128; i++) {
            let rand: number = Math.random()
            if (rand === 0 || rand <= 0.5 && Sheep._sheepCount < 50) {
                this._totalAnimals.push(new Sheep(i))
                // console.log(Sheep._sheepCount)
            } else if (rand > 0.5 && rand < 0.8) {
                this._totalAnimals.push(new Cow(i))
            } else if (rand >= 0.8) {
                this._totalAnimals.push(new Dog(i))
            }
        }
    };

    get totalAnimalGS(): Animal[] {
        return this._totalAnimals
    }

    async printAnimals() {
        for (let j: number = 0; j < this._totalAnimals.length; j++) {
            await premissionPrint('loop')
            let imageAnimal: Element = document.createElement("img")
            let animalElement: Element = document.createElement("div")
            animalElement.setAttribute('id', `${this._totalAnimals[j]._id}`)
            imageAnimal.setAttribute('src', `${this._totalAnimals[j]._src}`)
            imageAnimal.setAttribute('class', 'animal-el')
            animalElement.appendChild(imageAnimal)
            if (farmElement) {
                farmElement.appendChild(animalElement)
            }
        }
    }

    soundChanging(): void {
        setInterval(() => {
            let randomNumber: number = Math.floor(Math.random() * this._totalAnimals.length - 1)
            this._totalAnimals[randomNumber].changePosition = {bool: true, fieldName: '_sounding'};
            console.log(this._totalAnimals[randomNumber]);
            this._totalAnimals[randomNumber].displaySound()
            setTimeout(() => {
                this._totalAnimals[randomNumber].changePosition = {bool: false, fieldName: '_sounding'};
                this._totalAnimals[randomNumber].silent(this._totalAnimals[randomNumber]);
            }, 12000)
        }, 1200)
    }

    foodChanging(): void {
        setInterval(() => {
            let randomNumber: number = Math.floor(Math.random() * this._totalAnimals.length - 1)
            if (!this._totalAnimals[randomNumber]._fooding) {
                this._totalAnimals[randomNumber].changePosition = {bool: true, fieldName: '_fooding'};
                console.log(this._totalAnimals[randomNumber]);
                this._totalAnimals[randomNumber].displayFood()
            }
        }, 2000)
    }

    async fooder(event: Event) {

        const targetElement = (event.target as HTMLInputElement)
        let targetId: number = Number(targetElement?.parentElement?.id)
        console.log(targetElement?.parentElement?.children)
        let animalTarget: Animal | undefined = this._totalAnimals.find(animal => animal._id == targetId)
        if (animalTarget?._fooding) {
            console.log(animalTarget)
            console.log(document.querySelector(`.food-tx-${targetId}`))
            let foodImg: Element | null | undefined = document.querySelector(`.food-tx-${targetId}`)?.firstElementChild;
            foodImg?.setAttribute('src', 'assets/timer.gif');

        }
        await premissionPrint('once')
        document.querySelector(`.food-tx-${targetId}`)?.remove()
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let generalAnimals: AnimalGenertor = new AnimalGenertor()
    generalAnimals.generateAnimal()
    generalAnimals.printAnimals()
    generalAnimals.soundChanging()
    generalAnimals.foodChanging()
    farmElement?.addEventListener('click', (event) => {
        generalAnimals.fooder(event)
    })

})

