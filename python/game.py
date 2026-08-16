#To import some functions
import time
import random

#To do slow speed printing
def slow_print(text):
    for char in text:
        print(char, end='', flush=True)
        time.sleep(.09)
    print("")

def loading_screen():
    slow_print("\n\033[91mGame Starting...\033[0m")
    time.sleep(0.5)
    slow_print("\033[93mLoading resources...\033[0m")
    time.sleep(0.5)
    slow_print("\033[93mLoading environment...\033[0m")
    time.sleep(0.5)
    slow_print("\033[93mRunning scenario...\033[0m")
    time.sleep(1)

def start_game():
    loading_screen()
    while True:
        slow_print("\nYou are in a deserted area after the zombie outbreak.")
        slow_print("Ahead of you is an abandoned house, and there is a cave on the other side.")
        weapons=["Shotgun","AK-47","Glock Pistol","M249 Machine Gun"]
        weapon_random=random.choice(weapons)
        slow_print(f"You have a weapon: {weapon_random} but there is no ammo!")
        slow_print("1) Entering the abandoned house")
        slow_print("2) Entering the Dark Cave")
        slow_print("You need to make a decision quickly")
        time.sleep(.5)
        enter=input("\033[95mWill you go to (1) the abandoned house or (2) the dark cave? \033[0m")
        if enter == "1": enter_house()
        elif enter == "2": go_to_cave()
        else:
            slow_print("Not clear choice,try again.")
            continue

def enter_house():
    score=0
    health=0
    slow_print("\033[91mThere was a zombie inside and it attacked you!\033[0m")
    slow_print(f"your Score is:{score},and your health is:{health}")
    slow_print("\033[91mGame over!\033[0m")
    play_again()

def go_to_cave():
    slow_print("There is ammunition inside.")
    slow_print("..Zombie in the abandoned house!")
    slow_print("Enter the abandoned house to kill zombies.")
    ask_riddle()

def ask_riddle():
    score=0
    health=100
    slow_print("Answer some questions to kill zombies.")
    questions=[
        ("Who is the founder of SpaceX?",["Elon Musk","Bill Gates"],"1"),
        ("Who is the founder of Microsoft?",["Bill Gates and Elon Musk","Bill Gates and Paul Allen"],"2"),
        ("Who is the CEO of Open AI?",["Elon Musk","Sam Altman"],"2"),
        ("Who is the founder of Meta (Facebook)?",["Mark Zuckerberg","Bill Gates"],"1")]
    for i,(question,options,correct) in enumerate(questions,1):
        slow_print(f"\033[93m\nQ{i}\033[0m")
        slow_print(question)
        slow_print(f"1) {options[0]}")
        slow_print(f"2) {options[1]}")
        answer=input("\033[95mEnter your choice: \033[0m")
        if answer==correct:
            score+=50
            slow_print("Your answer is correct!")
        else: slow_print("Your answer is wrong!")
        slow_print(f"your Score is:{score},and your health is:{health}")
    if score>=100 and health==100:
        slow_print("\033[92m\nCongratulations,you win the game!\033[0m")
    else:
        slow_print("\033[91mUnfortunately,not all questions were answered correctly.\033[0m")
        slow_print("\033[91mThe zombies will remain.\033[0m")
        slow_print("\033[91mGame over!\033[0m")
    play_again()

def play_again():
    again=input("\033[95m\nWould you like to play again?Enter(y) for Yes or(n) for No: \033[0m").lower()
    while again not in ("y","n"):
        slow_print("Not clear choice,try again.")
        again=input("\033[95m\nWould you like to play again?Enter(y) for Yes or(n) for No: \033[0m").lower()
    if again=="y":
        print("\n\n\033[94m----- A new beginning -----\033[0m\n")
        start_game()
    else: slow_print("\033[93mThanks for playing! Always be ready!\033[0m")

start_game()
