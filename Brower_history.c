#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 100

struct Stack
{
    char pages[MAX][100];
    int top;
};

void push(struct Stack *s, char page[])
{
    if (s->top == MAX - 1)
    {
        printf("History is full!\n");
        return;
    }

    s->top++;
    strcpy(s->pages[s->top], page);
}

void pop(struct Stack *s, char page[])
{
    if (s->top == -1)
    {
        printf("No page available.\n");
        return;
    }

    strcpy(page, s->pages[s->top]);
    s->top--;
}

void display(struct Stack *s)
{
    int i;

    if (s->top == -1)
    {
        printf("History is empty.\n");
        return;
    }

    printf("\nBrowser History:\n");

    for (i = s->top; i >= 0; i--)
    {
        printf("%s\n", s->pages[i]);
    }
}

int main()
{
    struct Stack backStack, forwardStack;

    char current[100] = "Home";
    char page[100];

    backStack.top = -1;
    forwardStack.top = -1;

    int choice;

    while (1)
    {
        printf("\n===== Browser History Manager =====\n");
        printf("1. Visit New Page\n");
        printf("2. Back\n");
        printf("3. Forward\n");
        printf("4. Display History\n");
        printf("5. Exit\n");

        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
            case 1:
                printf("Enter page name: ");
                scanf("%s", page);

                push(&backStack, current);
                strcpy(current, page);

                forwardStack.top = -1;

                printf("Visited: %s\n", current);
                break;

            case 2:
                if (backStack.top == -1)
                {
                    printf("No previous page available.\n");
                }
                else
                {
                    push(&forwardStack, current);
                    pop(&backStack, current);

                    printf("Current Page: %s\n", current);
                }
                break;

            case 3:
                if (forwardStack.top == -1)
                {
                    printf("No forward page available.\n");
                }
                else
                {
                    push(&backStack, current);
                    pop(&forwardStack, current);

                    printf("Current Page: %s\n", current);
                }
                break;

            case 4:
                printf("\nCurrent Page: %s\n", current);
                display(&backStack);
                break;

            case 5:
                printf("Exiting Browser History Manager...\n");
                exit(0);

            default:
                printf("Invalid choice!\n");
        }
    }

    return 0;
}
