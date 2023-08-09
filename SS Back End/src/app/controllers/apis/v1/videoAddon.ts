import { AppDataSource } from '../../../../config';
import { Response } from 'express';
import { Request } from '../../../../utils/@types'
import VideoAddon from '../../../models/VideosAddon';



const VideoAddonRepo = AppDataSource.getRepository(VideoAddon);

export const videoAddonController = {

    getVideoAddons: async (req: Request, res: Response) => {

        try {
            const videoAddons = await VideoAddonRepo.find()
            if (!videoAddons) return res.status(200).json({ success: false, message: "No VideoAddons to display" })

            return res.status(200).json({ message: "VideoAddon successfully found", success: true, videoAddons: videoAddons })

        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },

    createVideoAddons: async (req: Request, res: Response) => {


        try {

            const { title, priceMonthly, description, fileSizeLimit, files } = req.body


            const extVideoAddon = await VideoAddonRepo.findOne({ where: { title } })

            if (extVideoAddon) return res.status(200).json({ success: false, message: "VideoAddon already exixsts." })

            var newVideoAddon = new VideoAddon()

            newVideoAddon.title = title
            newVideoAddon.priceMonthly = priceMonthly
            newVideoAddon.description = description
            newVideoAddon.fileSizeLimit = fileSizeLimit
            newVideoAddon.files = files
            newVideoAddon.addedBy = req.admin!

            const newEntity = await VideoAddonRepo.save(newVideoAddon)

            return res.status(200).json({ message: "VideoAddon successfully added", success: true, videoAddon: newEntity })


        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },


    updateVideoAddon: async (req: Request, res: Response) => {
        return res.end()


    },

    getVideoAddon: async (req: Request, res: Response) => {
        try {
            const videoAddon = await VideoAddonRepo.findOne({ where: { id: req.params.id } })
            if (!videoAddon) return res.status(200).json({ success: false, message: "No videoAddons to display" })

            return res.status(200).json({ message: "videoAddon successfully found", success: true, videoAddon: videoAddon })

        } catch (err) {
            console.log(err)
            return res.status(200).json({ success: false, message: "something went wrong!" })
        }
    },

    deleteVideoAddon: async (req: Request, res: Response) => {
        return res.end()
    },

}