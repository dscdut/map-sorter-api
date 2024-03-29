import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MapProvidersEnum } from '@shared/enum/map-providers.enum';
import { RouteEntity } from 'src/database/typeorm/entities/route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RouteSeedService {
  constructor(
    @InjectRepository(RouteEntity)
    private repository: Repository<RouteEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            id: '18c1e2d6-23e6-4f75-980f-b133973eebec',
            name: 'Route 1',
            pathDisplay: {
              overview_polyline:
                'g|caBqonsS`{RlfI|~^wcGbvXcr\\j~^qsZnvNkoQ`sHevNnlR{mMtne@{`D`sIcxNhdYmxJpwd@clWfqSs_Bxqf@jrFpdQc{IfmQnTxbn@nYbhh@ibPfic@gxH~eDwbHpjI`FjuJ`pDptI{}ChaKjvDzdKwxFphWcwCf|WsiHh}_@omE|b\\dcZjxh@zwPdrYu`LzcX|nV~yJ`wApaO}`In|QnxEhtOe~AbcXtpBdh_@`uOn{Sb~Nvp\\nzGpmMvyg@`Bl_m@~jSzkl@v~b@bje@dtNpuPvcEd}X_x@jgk@weA~jc@toDvjl@z~L`wS}h@`s]`jC~`^|jP|u]xfLn}Unc\\hsRzmEhfh@tfNfcf@~l[h}Drp`@`sMzHfJygOoaGwo`@uqJqnKug@iyJauSejBui`@caA}vRq}VoiPuq_@kxv@oxLodYt{CaoZisLu{\\c`Dcbg@gbCcu`@heDsrk@}yGyhm@mt`@qbb@qtSghT_iNqxi@ak@qim@yiGerO{hCmhRaz\\qvGqoc@iuWmw]y{MqpZdlEsuQswEgyObmI}cXa{Mi_H_hJm}LflCq_LreHkbP_mGsbc@{{Qm}Nm`QmmNcv@ew`@ztOsof@~|Da{IbzF{vHyvEqkQ|sAo~MiiBk~CreGqqRfjCil`@f|Gecn@fgRk}i@ymEuhPlnI_cUslBus]yrDcmgA`gh@iwHfpMmkN~nDqvUA{pStuL{sT|x\\sxx@`_v@cyk@phWqiPbvJgsBnoc@o`CvzZmg_@lmC{b[b_h@sfKdea@uyQhvSijNtaZukXvcNwzYd~JasZ~aS}tVpeZe{U|hMeaRxg@a|c@|{QweKl`K}_NxyBgeg@avFaxGfjW{wChgNqhJ`s@iyQbeWm_Gf}Qi~NppCsdMl{Smc^flMyrc@vpPolUdnTu{T`hGooKldGapk@cuVceY_mAerXj~Eqts@ynEegj@cmQmxVkaIi|Ee|P{kJmzOcjTtbEypy@nuGwzk@bgKehPfoDcbEqvG{kFp`FzzJxXzyl@}gLneh@wcIveTmce@j|[bt[b`NjgHvjDb}Tlbg@tcSt`TzaHpeFAkQycFtRty@qq@nwHrhHvSbsWxtAvmYvlBdaVs{F`nYrnBzok@z|UbwN_qC~kJuvBv~FwuHfaH_kI|pN}hM`xb@meNj{[cyL~_OupSn_NciBnuEaoSx`HmnPfgLesBtmLabWv_I}yOz`l@bdElvVmvPl`c@yxQf_^sr\\l_[_qa@|fq@c`Xp~YegVno_@sgb@zxRkkf@',
              input_polyline:
                'k|caBgonsSwbjAzzyBrowa@n}jD_xt}@b{dDvamFjzOwhtBcmlAvuk~@fqiA',
              waypoint_order: [0, 4, 1, 3, 2],
            },
            provider: MapProvidersEnum.GOOGLE_MAP,
            user: {
              id: '18c1e2d6-23e6-4f75-980f-b133973eebec',
            },
          },
        ]),
      );
    }
  }
}
