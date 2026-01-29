import { getOrderById } from "@/actions/order";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default async function OrderDetailId({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const order = await getOrderById(id);

  return (
    <div>
      <h1 className="h1 mb-3">Order ID: {order?.externalId}</h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Order ID</TableCell>
            <TableCell>{order?.externalId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Gateway</TableCell>
            <TableCell>{order?.gateway}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell>{order?.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Total Amount</TableCell>
            <TableCell>{order?.totalAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold flex-start">Order Items</TableCell>
            <TableCell>
              <ul>
                {order?.OrderItem.map((item) => (
                  <li key={item.id} className="list-disc list-inside first-letter:capitalize">
                    {item.Product.name} ({item.Product.price}x{item.quantity})
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
