export const shortenWalletAddress = (walletAddress, length = 20) => {
  const startLength = Math.ceil(length / 2);
  const endLength = Math.floor(length / 2);
  const start = walletAddress.substring(0, startLength);
  const end = walletAddress.substring(walletAddress.length - endLength);
  return `${start}...${end}`;
};
