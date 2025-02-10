// export const GetApi = async (url: string, headers: { Accept: string; 'Content-Type': string }, onResponse: (responseJson: any) => void, onCatch: (responseJson: any) => void, { url = '', header = {}, onResponse = null, onCatch = null }) => {

//     let base_url = "https://zkbsgdbbhc.execute-api.us-east-1.amazonaws.com/mvp/"
//     console.log('url ' + url)
//     console.log(' header: ' + JSON.stringify(header))

//     fetch(base_url + url, {
//         method: 'GET',
//         headers: header,
//     })
//         .then((response) => response.json())
//         .then((responseJson) => {
//             console.log("response: " + JSON.stringify(responseJson))
//             if (responseJson.status) {
//                 if (responseJson.status != 1 && responseJson.status !== 0) {
//                     console.log("if entered")
//                 }
//             }
//             else {
//                 console.log("else entered")
//             }

//             onResponse && onResponse(responseJson)

//         })
//         .catch((e) => {
//             console.log('error bellow')
//             console.log(e)
//             console.log('error Json ' + JSON.stringify(e))
//             console.log('error toString ' + e.toString())

//             onCatch && onCatch(e)

//         })

// }

type Callback<T = any> = (data: T) => void;

interface FileData {
  uri: string;
  name: string;
  type: string;
}

export const getapi = async (
  url: string = '',
  header: Record<string, string> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  file: FileData | null = null,
): Promise<any> => {
  let base_url = 'https://zkbsgdbbhc.execute-api.us-east-1.amazonaws.com/Dev/';
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };

  fetch(base_url + url, {
    method: 'GET',
    headers: header,
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log('response: ' + JSON.stringify(responseJson));
      if (responseJson) {
        console.log('if entered');
      } else {
        console.log('else entered');
      }

      onResponse && onResponse(responseJson);
    })
    .catch(e => {
      console.log('error bellow');
      console.log(e);
      console.log('error Json ' + JSON.stringify(e));
      console.log('error toString ' + e.toString());

      onCatch && onCatch(e);
    });
};
