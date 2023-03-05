export function downloadCSV(data: Record<string, any>[], filename: string) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function convertToCSV(data: Record<string, any>[]) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((obj) => Object.values(obj).join(','));
    return `${header}\n${rows.join('\n')}`;
}
