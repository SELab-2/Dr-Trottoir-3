// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';

type Data = {
    name: string
}


/**
 * @param {NextApiRequest} req Request.
 * @param {NextApiResponse} res Response.
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({name: 'John Doe'});
}
