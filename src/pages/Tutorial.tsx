import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Play, 
  Download, 
  CreditCard, 
  Smartphone, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Tutorial() {
  const tutorialSteps = [
    {
      step: 1,
      title: "选择充值套餐",
      description: "根据您的需求选择合适的充值套餐",
      details: [
        "浏览不同价格的套餐选项",
        "对比积分数量和价格",
        "选择标有「推荐」的热门套餐",
      ],
      image: "📱"
    },
    {
      step: 2,
      title: "填写联系信息",
      description: "输入您的邮箱地址以接收卡密",
      details: [
        "确保邮箱地址正确无误",
        "检查垃圾邮件文件夹",
        "我们承诺保护您的隐私",
      ],
      image: "📧"
    },
    {
      step: 3,
      title: "扫码完成支付",
      description: "使用手机扫描二维码支付",
      details: [
        "支持微信支付和支付宝",
        "确认支付金额无误",
        "支付成功后点击确认",
      ],
      image: "💳"
    },
    {
      step: 4,
      title: "获取专属卡密",
      description: "支付成功后立即获得充值卡密",
      details: [
        "卡密将显示在页面上",
        "同时发送到您的邮箱",
        "请妥善保管卡密信息",
      ],
      image: "🔑"
    },
    {
      step: 5,
      title: "使用卡密充值",
      description: "在目标平台使用卡密完成充值",
      details: [
        "登录您的目标账户",
        "找到充值或卡密兑换入口",
        "输入卡密并确认充值",
      ],
      image: "✅"
    }
  ];

  const videoTutorials = [
    {
      title: "完整充值流程演示",
      duration: "3:45",
      description: "从选择套餐到完成充值的完整流程演示",
      thumbnail: "🎥"
    },
    {
      title: "常见问题解答",
      duration: "2:30",
      description: "解答用户在充值过程中遇到的常见问题",
      thumbnail: "❓"
    },
    {
      title: "安全注意事项",
      duration: "1:55",
      description: "充值过程中需要注意的安全事项",
      thumbnail: "🔐"
    }
  ];

  const faqs = [
    {
      question: "卡密多长时间内有效？",
      answer: "所有卡密的有效期为30天，请在有效期内使用。"
    },
    {
      question: "支付后多久能收到卡密？",
      answer: "一般情况下，支付成功后会立即生成卡密，同时发送到您的邮箱。"
    },
    {
      question: "如果卡密使用失败怎么办？",
      answer: "请检查卡密输入是否正确，如仍有问题请联系客服处理。"
    },
    {
      question: "可以退款吗？",
      answer: "未使用的卡密在购买后7天内可以申请退款。"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          使用教程
        </h1>
        <p className="text-muted-foreground text-lg">
          详细的图文教程，帮助您快速完成充值操作
        </p>
      </div>

      {/* 图文教程 */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">图文教程</h2>
          <Badge className="bg-primary/10 text-primary">推荐阅读</Badge>
        </div>

        <div className="grid gap-6">
          {tutorialSteps.map((step, index) => (
            <Card key={index} className="card-elevated overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* 步骤图标 */}
                  <div className="w-24 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-4xl">{step.image}</div>
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="step-active w-8 h-8 rounded-full flex items-center justify-center p-0">
                            {step.step}
                          </Badge>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 视频教程 */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Play className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">视频教程</h2>
          <Badge className="bg-info/10 text-info">即将上线</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {videoTutorials.map((video, index) => (
            <Card key={index} className="card-elevated hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl border-b">
                  {video.thumbnail}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{video.title}</h3>
                    <Badge variant="secondary">{video.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {video.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Play className="w-4 h-4 mr-2" />
                    即将上线
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 常见问题 */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <CheckCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">常见问题</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 下载指南 */}
      <section>
        <Card className="card-primary">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">下载完整指南</h3>
                <p className="text-muted-foreground mb-4">
                  获取详细的PDF版本教程，支持离线查看，包含更多实用技巧和注意事项。
                </p>
                <Button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  下载PDF指南
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 底部行动按钮 */}
      <div className="text-center">
        <Button size="lg" className="btn-primary">
          <span>开始充值</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}