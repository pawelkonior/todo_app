# Notes

## Pobieranie danych — podczas montowania komponentu

1. Trzeba mieć dostęp do API (np. json-server)
2. Stworzyć funkcję pobierającą dane (fetch/axios)
3. Stworzyć stan do którego zapiszemy te dane
4. Należy wywołać funkcje w momencie kiedy komponent jest dodany do HTML (componentDidMount, useEffect)

```javascript

// AD.2 funkcja do pobierania danych z określonego adresu URL, async zawsze zwraca Promise,
// więc musimy go obsłużyć jak promise czyli then/catch bądź await w async function
async function getAllTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    return response.json()
}

// AD.3 Aby stworzyć stan komponentu funkcyjnego należy użyć useState lub useReducer, oba trzeba importować
// useState przyjmuje initial state, czyli wartość początkową, jeżeli to input to najczęściej pusty string,
// jeżeli to wiele danych to prawdopodobnie będzie to pusta tablica. useState zwraca tablice 2 elementową,
// dlatego ją destrukturyzyjemy, pierwszy element to zmienna reprezentująca stan, a druga to funkcja
// która modyfikuje zmienną reprezentująca stan.
import {useState} from 'react';
const [task, setTask] = useState([]);

// AD.4 Aby wykonać funkcję podczas montowania komponentu, można użyć useEffect z drugim, który musi być
// tablicą, natomiast jeżeli to ma się wykonać raz, to tablica musi być pusta
// - brak drugiego parametru, lub falsy value -> wykonuje przy każdym rerenderze komponentu
// - pusta tablica -> wykonuje po dodaniu komponentu do html
// - tablica z zależnościami (zmiennymi) -> wykonuje na początku i przy każdej zmianie wartości z tablicy
// wewnątrz callback do useEffect mamy wywołanie funkcji, która pobiera dane, w związku z tym, że jest
// asynchroniczna (Promise based) to obsługujemy ją przez then/catch
import {useEffect} from 'react';
useEffect(() => {
    getAllTasks()
        .then((data) => setTask(data))
        .catch(console.error)
}, [])

```

## Dodawanie danych do aplikacji przez użytkownika

1. UI, user interface, najlepiej używać znacznik form

```jsx

<form>
    <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title"/>
    </div>
    <div>
        <label htmlFor="desc">Description</label>
        <textarea id="desc" name="desc"/>
    </div>
    <button>Add</button>
</form>


```

2. Obsługa formularzy/inputów może być zrobiona na 3 podstawowe sposoby:
   - controlled inputs (potrzebny stan i funkcja, która po wyemitowaniu zdarzenia go aktualizuje)
   - uncontrolled inputs (obsługujemy dane dopiero jak użytkownik chce je wysłać)
   - biblioteki -> Formik + Yup do walidacji

3. Wysłać dane na serwer, po odpowiedzi serwera aktualizuje stan














