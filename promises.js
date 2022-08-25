// Constants for high load period
const HIGH_LOAD_PERIOD_START = new Date().setHours(17,30,0);
const HIGH_LOAD_PERIOD_END = new Date().setHours(18,30,0);

const doTask = (taskName) => {
    const begin=Date.now()
  
    return new Promise(function(resolve, reject) {

      setTimeout(function() {
        const end= Date.now()
        const timeSpent=(end-begin) + "ms"
  
        console.log('\x1b[36m', "[TASK] FINISHED: " + taskName + " in " + timeSpent ,'\x1b[0m')
        
        resolve(true)
      }, (Math.random() * 2000))

    })
  }
  
  const manageConcurrency = (taskList, concurrencyMax, concurrencyCurrent) => {
    // Array of promises we already took in work
    // I decided to use it instead of counter parameter
    const initedTasksList = []

    // In this function we manage amount of cuncurrencyCurrent
    // Remember inited tasks
    // Starting new task if previous task was done
    const doTaskWrapper = (taskName) => {
        initedTasksList.push(taskName)
        concurrencyCurrent++

        doTask(taskName).then(() => {
            concurrencyCurrent--
            // Little recursion
            // We start this function every time one of the promise was done
            executeNextTask()
        })
    }

    // Main function
    // We check all condition, filter uncomplited tasks from completed tasks
    // Starting task for every "empty slot"
    const executeNextTask = () => {
        if (taskList.length === initedTasksList.length) {
            console.log('Done');
            return
        }

        const currentTime = new Date()

        // An example of condition for dynamical cuncurrencyMax value
        // There can be any condition
        if (currentTime >= HIGH_LOAD_PERIOD_START && currentTime < HIGH_LOAD_PERIOD_END) {
            concurrencyMax = 100
        } else {
            concurrencyMax = 10
        }

        for (let i = 0; i <= concurrencyMax - concurrencyCurrent; i++) {
            const uncomplitedTasks = taskList.filter(task => !initedTasksList.includes(task))

            doTaskWrapper(uncomplitedTasks[0])
        }
    }

    executeNextTask()
    
    return 
  }
  
  async function init() {
    numberOfTasks = 500
  
    const concurrencyMax = 4
    const taskList = [...Array(numberOfTasks)].map(() => [...Array(~~(Math.random() * 10 + 3))].map(() => String.fromCharCode(Math.random() * (123 - 97) + 97)).join('') )
    const concurrencyCurrent = 0
  
    console.log("[init] Concurrency Algo Testing...")
    console.log("[init] Tasks to process: ", taskList.length)
    console.log("[init] Task list: " + taskList)
    console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n")
  
    await manageConcurrency(taskList, concurrencyMax, concurrencyCurrent)
  }
  
  init()
