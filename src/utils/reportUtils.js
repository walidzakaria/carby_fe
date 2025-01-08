export function getReport(preview, response) {

  if (preview) {
    const printWindow = window.open('', '_blank', 'height=600,width=950,scrollbars=yes');
    printWindow.document.write(response);
    printWindow.document.close();
  } else {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.top = '-9999px';
    printIframe.style.left = '-9999px';
    document.body.appendChild(printIframe);

    const printDocument = printIframe.contentDocument || printIframe.contentWindow.document;

    // Write the report content to the iframe
    printDocument.open();
    printDocument.write(response);
    printDocument.close();

    // Trigger the print function
    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();

    // Clean up the iframe after printing
    setTimeout(() => {
      document.body.removeChild(printIframe);
    }, 1000);
  }

}
