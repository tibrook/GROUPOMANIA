import { createGlobalStyle } from "styled-components";

const StyledGlobalStyle = createGlobalStyle`
    * {
        font-family: Lato, Helvetica, sans-serif;
    }
 
    body {
        margin: 0;  
    }
    .itemCard{
        list-style-type: none;
        text-decoration: none;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content : space-between;
        
    }
`;
function GlobalStyle() {
  return <StyledGlobalStyle />;
}
export default GlobalStyle;
