type Callback<T = any> = (data: T) => void;

interface FileData {
  uri: string;
  name: string;
  type: string;
}

let base_url = 'https://zkbsgdbbhc.execute-api.us-east-1.amazonaws.com/Dev/';

export const postApi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };
  console.log(body);

  fetch(base_url + url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });
  fetch(base_url + url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
    .then(async response => {
      const text = await response.text();
      console.log('Raw Response:', text);

      try {
        const fixedText = text.replace(
          /"token":\s*([^"{\[][^,}\]]*)/g,
          '"token": "$1"',
        );

        return JSON.parse(fixedText);
      } catch (error) {
        console.error('JSON Parse Error:', error);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    })
    .then(responseJson => {
      console.log('Parsed JSON:', responseJson);
      onResponse && onResponse(responseJson);
    })
    .catch(e => {
      console.error('Fetch Error:', e);
      onCatch && onCatch(e);
    });
};

export const getapi = async (
  url: string = '',
  header: Record<string, string> = {},
  onResponse: ((data: any) => void) | null = null,
  onCatch: ((error: any) => void) | null = null
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };

  console.log('Headers:', headers);

  try {
    const response = await fetch(base_url + url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const responseJson = await response.json();
    console.log('Response:', responseJson);

    if (onResponse) {
      onResponse(responseJson);
    }

    return responseJson; 
  } catch (error) {
    console.error('API Fetch Error:', error);

    if (onCatch) {
      onCatch(error);
    }

    return null; 
  }
};

export const putapi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };
  console.log(body);

  fetch(base_url + url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(body),
  });
  fetch(base_url + url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
    .then(async response => {
      const text = await response.text();
      console.log('Raw Response:', text);

      try {
        const fixedText = text.replace(
          /"token":\s*([^"{\[][^,}\]]*)/g,
          '"token": "$1"',
        );

        return JSON.parse(fixedText);
      } catch (error) {
        console.error('JSON Parse Error:', error);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    })
    .then(responseJson => {
      console.log('Parsed JSON:', responseJson);
      onResponse && onResponse(responseJson);
    })
    .catch(e => {
      console.error('Fetch Error:', e);
      onCatch && onCatch(e);
    });
};