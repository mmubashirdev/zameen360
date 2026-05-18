#include <iostream>
#include <thread>
using namespace std;

/* Peterson's Algorithm */

bool flag[2] = {false, false};
int turn;

void process0() {

    for (int i = 0; i < 5; i++) {

        flag[0] = true;   // Process 0 wants to enter
        turn = 1;         // Give chance to Process 1

        // Wait if Process 1 wants to enter
        while (flag[1] && turn == 1);

        // Critical Section
        cout << "Process 0 in Critical Section\n";

        // Exit Section
        flag[0] = false;
    }
}

void process1() {

    for (int i = 0; i < 5; i++) {

        flag[1] = true;   // Process 1 wants to enter
        turn = 0;         // Give chance to Process 0

        // Wait if Process 0 wants to enter
        while (flag[0] && turn == 0);

        // Critical Section
        cout << "Process 1 in Critical Section\n";

        // Exit Section
        flag[1] = false;
    }
}

int main() {

    thread t1(process0);
    thread t2(process1);

    t1.join();
    t2.join();

    return 0;
}