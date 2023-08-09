import { AppDataSource } from '../../../../config';
import { Response } from 'express';
import { Request } from '../../../../utils/@types'
import StorageAddon from '../../../models/StorageAddon';



const StorageAddonRepo = AppDataSource.getRepository(StorageAddon);

export const storageAddonController = {

    getStorageAddons: async (req: Request, res: Response) => {

        try {
            const storageAddons = await StorageAddonRepo.find()
            if (!storageAddons) return res.status(200).json({ success: false, message: "No StorageAddons to display" })

            return res.status(200).json({ message: "StorageAddon successfully found", success: true, storageAddons: storageAddons })

        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },

    createStorageAddons: async (req: Request, res: Response) => {


        try {

            const { title, priceMonthly, description } = req.body


            const extStorageAddon = await StorageAddonRepo.findOne({ where: { title } })

            if (extStorageAddon) return res.status(200).json({ success: false, message: "StorageAddon already exixsts." })

            var newStorageAddon = new StorageAddon()

            newStorageAddon.title = title
            newStorageAddon.priceMonthly = priceMonthly
            newStorageAddon.description = description
            newStorageAddon.addedBy = req.admin!

            const newEntity = await StorageAddonRepo.save(newStorageAddon)

            return res.status(200).json({ message: "StorageAddon successfully added", success: true, storageAddon: newEntity })


        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },


    updateStorageAddon: async (req: Request, res: Response) => {
        return res.end()


    },

    getStorageAddon: async (req: Request, res: Response) => {
        try {
            const storageAddon = await StorageAddonRepo.findOne({ where: { id: req.params.id } })
            if (!storageAddon) return res.status(200).json({ success: false, message: "No storageAddons to display" })

            return res.status(200).json({ message: "storageAddon successfully found", success: true, storageAddon: storageAddon })

        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },

    deleteStorageAddon: async (req: Request, res: Response) => {
        return res.end()
    },

}