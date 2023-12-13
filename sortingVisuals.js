const barContainer = document.getElementById('bar-container');
const sizeSlider = document.getElementById('size');
const speedSlider = document.getElementById('speed');
const sortType = document.querySelector(".type-btn");
let arr = [];
let audioCtx = null;
function beep(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}
async function randomise(){
    let n = 2*sizeSlider.value; // 
    barContainer.style.width = `${(20*n - 10)}px`;
    arr = [];
    for(let i = 0; i < n; i++){
        arr.push(Math.floor(100*Math.random()));
    }
    await displayBarsInit();
}
async function displayBarsInit(){
    let n = 5*sizeSlider.value;
    barContainer.innerHTML="";
    for(let i = 0; i < n; i++){
        const bar = document.createElement('div');
        bar.style.height = arr[i] + "%";
        bar.style.width = "10px";
        bar.classList.add('bar-blue');
        bar.classList.add('bar');
        await new Promise((resolve)=>{
            setTimeout(()=>{
                beep(200 + 5*arr[i]);
                barContainer.appendChild(bar);
                resolve(1);
            }, 100);
        });
    }
}
function displayBars(){
    let n = 2*sizeSlider.value; // 
    barContainer.innerHTML="";
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < n; i++){
        const bar = document.createElement('div');
        bar.style.height = arr[i] + "%";
        bar.style.width = "10px";
        bar.classList.add('bar-blue');
        bar.classList.add('bar');
        fragment.appendChild(bar);
    }
    barContainer.appendChild(fragment);
}

async function bubbleSort(speed) {
    let n = 2*sizeSlider.value; // 
    let bars = document.getElementsByClassName('bar');
    for (let i = n - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                beep(200 + arr[j] * 5);
                beep(200 + arr[j + 1] * 5);
                await new Promise((resolve) => {
                    setTimeout(() => {
                        bars[j].classList.add("bar-yellow");
                        bars[j + 1].classList.add("bar-yellow");
                        [bars[j].style.height, bars[j + 1].style.height] = [bars[j + 1].style.height, bars[j].style.height]
                        resolve(1);
                    }, speed);
                });
                await new Promise((resolve) => {
                    setTimeout(() => {
                        bars[j].classList.remove("bar-yellow")
                        bars[j + 1].classList.remove("bar-yellow");
                        bars[j].classList.add("bar-blue")
                        bars[j + 1].classList.add("bar-blue");
                        resolve(1);
                    }, speed); 
                });
            }
        }
        bars[i].classList.add("bar-green");
    }    
    displayBars();
}
async function insertionSort(speed){
    let bars = document.getElementsByClassName('bar');
    let n = 2*sizeSlider.value; //
    for(let i = 1; i < n; i++){
        let num = arr[i];
        let j = i - 1;
        for(; j >= 0 && arr[j] > num; j--){
            await new Promise((resolve) => { 
                bars[j].classList.add("bar-pink");
                beep(200 + arr[j] * 5);
                setTimeout(()=>{
                    bars[j].classList.remove("bar-pink");
                    bars[j].classList.add("bar-blue");
                    resolve(1);
                }, speed);
            })
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = num;
        await new Promise((resolve)=>{
            bars[i].classList.add("bar-yellow")
            if(j >= 0)
                bars[j].classList.add("bar-yellow")
            setTimeout(()=>{
                bars[i].classList.remove("bar-yellow")
                bars[i].classList.add("bar-blue")
                if(j >= 0){
                    bars[j].classList.remove("bar-yellow")
                    bars[j].classList.add("bar-blue")
                }
                displayBars();
                resolve(1);
            }, speed);
        });
        beep(200 + arr[i] * 5)
    }
}
async function selectionSort(speed) {
    let bars = document.getElementsByClassName('bar');
    let n = 2*sizeSlider.value; //
    for(let i = 0; i < n; i++)
    {
        let min = i;
        for(let j = i; j < n; j++)
        {
            beep(200 + arr[j] * 5);
            await new Promise((resolve)=>{
                bars[j].classList.add("bar-pink");
                setTimeout(()=>{
                    bars[j].classList.remove("bar-pink");
                    bars[j].classList.add("bar-blue");
                    resolve(1);
                }, speed);
            });
            if(arr[j] < arr[min]){
                bars[min].classList.remove("bar-yellow");
                bars[min].classList.add("bar-blue");
                bars[j].classList.add("bar-yellow");
                min = j;
            }
        }
        [arr[min], arr[i]] = [arr[i], arr[min]];
        [bars[min].style.height, bars[i].style.height] = [bars[i].style.height, bars[min].style.height];
        bars[min].classList.remove("bar-yellow");
        bars[min].classList.add("bar-blue");
        bars[i].classList.remove("bar-blue");
        bars[i].classList.add("bar-green");
    }
    displayBars();
}
async function merge(l, mid, r, bars, speed)
{
    let temp = [];
    let low = l, high = mid+1, ptr = l;
    while(low <= mid && high <= r)
    {
        if(arr[low] <= arr[high]){
            temp.push(arr[low]);
            low++;
        }
        else{
            temp.push(arr[high]);
            high++;
        }
        await new Promise((resolve)=>{
            bars[ptr].classList.add("bar-green");
            setTimeout(()=>{
                resolve(1);
            }, speed);
        });
        ptr++;
    }
    while(low <= mid)
    {
        temp.push(arr[low]);
        low++;
        await new Promise((resolve)=>{
            bars[ptr].classList.add("bar-green");
            setTimeout(()=>{
                resolve(1);
            }, speed);
        });
        ptr++;
    }
    while(high <= r)
    {
        temp.push(arr[high]);
        high++;
        await new Promise((resolve)=>{
            bars[ptr].classList.add("bar-green");
            setTimeout(()=>{
                resolve(1);
            }, speed);
        });
        ptr++;
    }
    for(let i = l; i <= r; i++)
        arr[i] = temp[i - l];
}
async function mergeSort(l, r, bars, speed) {
    if(l == r)
        return;
    let mid = Math.floor((l+r)/2);
    await new Promise((resolve)=>{
        beep(200 + arr[mid]*5);
        bars[mid].classList.add("bar-yellow");
        setTimeout(()=>{
            bars[mid].classList.add("bar-blue");
            resolve(1);
        }, speed);
    });
    await mergeSort(l, mid, bars, speed);
    await mergeSort(mid + 1, r, bars, speed);
    await merge(l, mid, r, bars, speed);
    await new Promise((resolve)=>{
        displayBars();
        setTimeout(()=>{
            resolve(1);
        }, speed);
    })
}
async function partition(start, end, bars, speed)  
{  
    let pivot = arr[end];   
    let i = start;  
    await new Promise((resolve)=>{
        bars[end].classList.add("bar-green");
        beep(200 + arr[end] * 5);
        setTimeout(()=>{
            displayBars();
            resolve(1);
        }, speed);
    });
    for (let j = start; j <= end - 1; j++)  
    {    
        if (arr[j] < pivot)  
        {  
            beep(200 + arr[j] * 5);
            beep(200 + arr[i] * 5);
            await new Promise((resolve)=>{
                bars[i].classList.add("bar-yellow");
                bars[j].classList.add("bar-yellow");
                setTimeout(()=>{
                    displayBars();
                    resolve(1);
                }, speed);
            });
            [arr[i], arr[j]] = [arr[j], arr[i]];  
            i++;  
        }  
    }  
    await new Promise((resolve)=>{
        beep(200 + arr[i] * 5);
        beep(200 + arr[end] * 5);
        bars[i].classList.add("bar-yellow");
        bars[end].classList.add("bar-yellow");
        setTimeout(()=>{
            displayBars();
            resolve(1);
        }, speed);
    });
    [arr[i], arr[end]] = [arr[end], arr[i]];
    return i;  
}  
async function quickSort(start, end, bars, speed) 
{  
    if (start < end)  
    {  
        let p = await partition(start, end, bars, speed);   
        await quickSort(start, p - 1, bars, speed);  
        await quickSort(p + 1, end, bars, speed);  
    }  
    displayBars();
}    
function Sort(){
    let speed = (250 - 10*speedSlider.value);
    if(sortType.value=="bubble")
        bubbleSort(speed);
    else if(sortType.value=="insertion")
        insertionSort(speed);
    else if(sortType.value=="selection")
        selectionSort(speed);
    else if(sortType.value=="quick")
        quickSort(0, ((2*sizeSlider.value)-1), document.getElementsByClassName('bar'), speed); //
    else 
        mergeSort(0, ((2*sizeSlider.value)-1), document.getElementsByClassName('bar'), speed); //
}
randomise();