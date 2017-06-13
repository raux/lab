var brain = new deepqlearn.Brain(3, 2); // 3 inputs, 2 possible outputs (0,1)
var state = [Math.random(), Math.random(), Math.random()];
for(var k=0;k<10000;k++) {
    var action = brain.forward(state); // returns index of chosen action
    //console.log(action)
    var reward = action === 0 ? 1.0 : 0.0;
    brain.backward([reward]); // <-- learning magic happens here
    state[Math.floor(Math.random()*3)] += Math.random()*2-0.5;
}
brain.epsilon_test_time = 0.0; // don't make any more random choices
brain.learning = false;
// get an optimal action from the learned policy
var action = brain.forward(array_with_num_inputs_numbers);
